require("dotenv").config();
const express = require("express");
const { createClient } = require("@supabase/supabase-js");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
const fetch = require("node-fetch");
// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.get("/todos", async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    console.log(data);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

app.post("/todos", async (req, res, next) => {
  try {
    const { text, status } = req.body;

    if (!text || !status || typeof text !== "string") {
      return res.status(400).json({ error: "Valid text is required" });
    }

    const { data, error } = await supabase
      .from("todos")
      .insert([{ text, status }])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    next(error);
  }
});

app.put("/todos/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Valid text is required" });
    }

    const { data, error } = await supabase
      .from("todos")
      .update({ text })
      .eq("id", id)
      .select();

    if (error) throw error;

    if (data.length === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json(data[0]);
  } catch (error) {
    next(error);
  }
});

app.patch("/todos/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data: existingTodo, error: fetchError } = await supabase
      .from("todos")
      .select("completed")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;
    if (!existingTodo) return res.status(404).json({ error: "Todo not found" });

    const { data, error } = await supabase
      .from("todos")
      .update({ completed: !existingTodo.completed })
      .eq("id", id)
      .select();

    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    next(error);
  }
});

app.delete("/todos/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data: existingTodo, error: fetchError } = await supabase
      .from("todos")
      .select("id")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;
    if (!existingTodo) return res.status(404).json({ error: "Todo not found" });

    const { error } = await supabase.from("todos").delete().eq("id", id);

    if (error) throw error;
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

app.post("/summarize", async (req, res, next) => {
  try {
    const { todos } = req.body;
    console.log(todos);
    if (!todos || !Array.isArray(todos) || todos.length === 0) {
      return res
        .status(400)
        .json({ error: "Todos array is required and cannot be empty" });
    }
    const todosText = todos
      .map((todo, i) => `${i + 1}. ${todo.text}`)
      .join("\n");

    const prompt = `
This is my todo list represented as an array. Read all the items carefully and provide a clear, concise, and efficient summary in one paragraph. Summarize the key tasks and priorities without adding unnecessary details:

${todosText}
`;

    const payload = {
      contents: [
        {
          parts: [{ text: prompt.trim() }],
        },
      ],
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

    if (result.candidates && result.candidates.length > 0) {
      const summary = result.candidates[0].content.parts[0].text;
      await fetch(SLACK_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `📝 *Your pending Todos Summary:*\n${summary}`,
        }),
      });
      res.json({ summary });
    } else {
      res.status(500).json({ error: "Failed to generate summary" });
    }
  } catch (error) {
    next(error);
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
