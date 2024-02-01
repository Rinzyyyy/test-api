const app = express();
app.use(bodyParser.json());

let todos = [
  { id: 1, title: 'Buy milk', completed: false },
  { id: 2, title: 'Go to gym', completed: true }
];

// GET /todos
app.get('/todos', (req, res) => {
  res.send(todos);
});

// POST /todos
app.post('/todos', (req, res) => {
  const todo = req.body;
  todos.push(todo);
  res.send(todo);
});