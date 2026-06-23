// Fallback Content Database for LernX Platform Courses

const TOPICS = {
  HTML: {
    videoTitle: "HTML Full Course for Beginners",
    videoUrl: "https://www.youtube.com/embed/ok-plXXHlWw",
    topics: [
      { name: "Introduction to HTML5 & Document Structure", content: "HTML5 is the standard markup language for Web pages. A basic HTML structure begins with <!DOCTYPE html> followed by <html>, <head> containing metadata/title, and <body> containing visual layouts. Semantic tags like <header>, <nav>, <main>, <section>, and <footer> provide meaningful context to the document tree, making websites readable for crawlers and assistive devices." },
      { name: "HTML Forms, Inputs and Attributes", content: "Forms collect user inputs using <form> containers. Essential elements include <input> with various types (text, email, password, radio, checkbox, submit), <label> linked via the 'for' attribute, and <textarea>. Attributes like 'required', 'placeholder', 'maxlength', and 'pattern' help perform client-side constraints out-of-the-box before submitting headers." },
      { name: "Semantic Elements and HTML5 Features", content: "HTML5 introduced clean structural outlines to replace generic <div> blocks. Elements like <article> define self-contained articles, <aside> marks auxiliary sidebars, and <figure>/<figcaption> group media assets. Additionally, structural helpers like <details> and <summary> provide native accordions directly in the browser markup." },
      { name: "Web Accessibility (A11y) & ARIA Guidelines", content: "Accessibility ensures websites are usable by everyone. Implementing descriptive 'alt' tags for images, using relative font units, enforcing proper color contrast, and organizing heading hierarchies (H1 to H6) are fundamental. ARIA (Accessible Rich Internet Applications) attributes like role='banner' and aria-describedby guide screen readers through custom interactive widgets." }
    ],
    assignments: [
      { title: "Task 1: Build a Semantic Layout Template", description: "Design a static mockup structure using exclusively structural semantic blocks (<header>, <nav>, <main>, <aside>, <footer>) instead of generic div layouts." },
      { title: "Task 2: Code an Accessible Register Form", description: "Implement a student registration form containing inputs for full name, password, email, and department. Link labels properly with the matching ID references." },
      { title: "Task 3: Embed Local Media with Descriptions", description: "Use HTML5 <figure>, <picture> and <iframe> elements to present an interactive media block complete with caption summaries." },
      { title: "Task 4: Implement Navigation Link Skippers", description: "Write skip-navigation shortcuts for page keyboard users to directly focus past the navbar header to the primary container." },
      { title: "Task 5: Enforce Validation Constraints", description: "Use native HTML attributes (pattern, min, max, required) to validate custom format entries without relying on script rules." }
    ],
    quiz: [
      { question: "Which HTML5 element is used to define the main content area of a document?", options: ["<content>", "<section>", "<main>", "<body>"], answer: "<main>" },
      { question: "What is the purpose of the 'alt' attribute on an image tag?", options: ["To style the image border", "To provide alternative text for screen readers", "To define the image resolution", "To cache the image source"], answer: "To provide alternative text for screen readers" },
      { question: "Which attribute is used to group multiple radio inputs together?", options: ["id", "class", "name", "value"], answer: "name" },
      { question: "What does HTML stand for?", options: ["Hyper Text Markup Language", "Hyperlink Text Management Language", "Home Tool Markup Language", "Hyper Transfer Makeup Language"], answer: "Hyper Text Markup Language" },
      { question: "Which tag is used to create a drop-down list in HTML?", options: ["<list>", "<input type='dropdown'>", "<select>", "<options>"], answer: "<select>" }
    ],
    finalTask: "Create a complete, responsive personal portfolio index using strict semantic HTML5 markup and conforming fully to WCAG 2.1 AA accessibility guidelines."
  },
  CSS: {
    videoTitle: "CSS Tutorial Full Course",
    videoUrl: "https://www.youtube.com/embed/wRNinF7YQqQ",
    topics: [
      { name: "CSS Selectors, Box Model, and Typography", content: "CSS controls web styling. Selectors (class, ID, tag, attribute, pseudo-classes) target specific DOM items. The Box Model dictates margins, borders, padding, and contents. Font metrics are styled using properties like font-family, line-height, and font-weight, preferably using relative units (em, rem, %) to support user text scaling." },
      { name: "Flexbox Layout and Alignment Systems", content: "Flexbox is a one-dimensional alignment model. Setting display: flex turns the parent into a flex container. Flex direction (row, column) defines the main axis. items are aligned along the main axis using justify-content (flex-start, space-between, center) and along the cross axis using align-items (stretch, center)." },
      { name: "CSS Grid Layout and Grid Templates", content: "CSS Grid is a two-dimensional layout system that defines grids of columns and rows. Setting display: grid allows defining explicit track tracks using grid-template-columns and grid-template-rows, often using the 'fr' fraction unit and utility tools like repeat() and minmax()." },
      { name: "Transitions, Keyframes, and Animations", content: "Transitions animate CSS properties smoothly over duration (transition: all 0.3s ease). Custom animations are built using keyframes (@keyframes name { from {...} to {...} }) and applied via animation shorthand, defining iteration count, easing functions, and fill modes." }
    ],
    assignments: [
      { title: "Task 1: Implement the Box Model Layout", description: "Design a profile card with 15px internal padding, a solid 2px border, and a 20px external margin, verifying overall dimension metrics." },
      { title: "Task 2: Build a Flexbox Header Bar", description: "Create a sticky header containing a logo aligned left and links aligned right using the flexbox alignment properties." },
      { title: "Task 3: Develop a 3-Column Responsive Grid", description: "Use CSS Grid repeat and minmax configurations to create a product gallery card grid that automatically wraps on mobile viewports." },
      { title: "Task 4: Animate a Loading Spinner", description: "Write keyframe styles that rotate a border segment infinitely to display a premium loading icon spinner." },
      { title: "Task 5: Implement CSS Themes with Variables", description: "Configure root variable variables (--bg-color, --text-color) and toggle them to support dark/light styling modes." }
    ],
    quiz: [
      { question: "Which CSS property controls the spacing outside an element's border?", options: ["padding", "margin", "border-spacing", "outline"], answer: "margin" },
      { question: "What is the default value of the position property in CSS?", options: ["relative", "absolute", "static", "fixed"], answer: "static" },
      { question: "Which unit is relative to the font-size of the root element?", options: ["em", "px", "vh", "rem"], answer: "rem" },
      { question: "Which flexbox property aligns items along the main axis?", options: ["align-items", "justify-content", "align-content", "flex-direction"], answer: "justify-content" },
      { question: "Which rule is used to define custom keyframe animations?", options: ["@animate", "@keyframes", "@keyframes-rule", "@transitions"], answer: "@keyframes" }
    ],
    finalTask: "Design and build a multi-page responsive marketing homepage using CSS Grid, Flexbox alignment, and micro-transitions on interactive controls."
  },
  JAVASCRIPT: {
    videoTitle: "JavaScript Full Course for Beginners",
    videoUrl: "https://www.youtube.com/embed/W6NZfCO5SIk",
    topics: [
      { name: "Variables, Scopes, and Data Structures", content: "JavaScript is a lightweight, dynamic scripting language. Variables are declared using let (block scoped), const (block scoped, read-only), or var (function scoped). Primitive types include string, number, boolean, null, undefined, and symbol. Objects, arrays, and functions constitute reference structures." },
      { name: "Functions, Arrow Syntax, and Scope Chains", content: "Functions represent reusable blocks of statement logic. Modern ES6 syntax includes Arrow functions (() => {}), which offer shorter expressions and lexically bind the 'this' value. Scope chains govern variable accessibility, determining how closures preserve references to outer function scopes." },
      { name: "DOM Selection and Event Handlers", content: "The Document Object Model (DOM) maps web structures. JS interacts with the DOM using selectors like document.querySelector(). Event listeners (element.addEventListener('click', handler)) capture user inputs, facilitating page reactions like form submissions, animations, and modal popups." },
      { name: "Asynchronous JavaScript, Promises & Async/Await", content: "Asynchronous behaviors prevent the single thread from blocking. Promises represent values that may resolve (resolve) or reject (reject) in the future. ES8 Async/Await syntax offers clean code blocks that look synchronous while handling promise resolutions behind the scenes." }
    ],
    assignments: [
      { title: "Task 1: Map and Filter Array Elements", description: "Write a function that takes an array of student objects and returns only those who score above 75, formatting their names to uppercase." },
      { title: "Task 2: Build a Counter with DOM Events", description: "Bind click handlers to increment and decrement buttons that update a text counter display in the HTML viewport." },
      { title: "Task 3: Fetch Data from an External API", description: "Use fetch and async/await syntax to request placeholder post items from a web API and render them inside list elements." },
      { title: "Task 4: Write a Basic Timer Utility", description: "Code a simple countdown timer function using setInterval that stops automatically once the target reaches zero." },
      { title: "Task 5: Implement a Debounce Helper", description: "Write a debouncing function to restrict text input keypress triggers from executing API requests excessively." }
    ],
    quiz: [
      { question: "Which keyword is block-scoped and allows reassignment?", options: ["var", "let", "const", "static"], answer: "let" },
      { question: "What does 'typeof null' return in JavaScript?", options: ["'null'", "'undefined'", "'object'", "'number'"], answer: "'object'" },
      { question: "Which method is used to add a new item to the end of an array?", options: ["push()", "pop()", "unshift()", "shift()"], answer: "push()" },
      { question: "What keyword is used to pause the execution of an async function until a promise resolves?", options: ["wait", "yield", "await", "defer"], answer: "await" },
      { question: "Which event fires when a user clicks on an HTML element?", options: ["onmouseover", "onclick", "onsubmit", "onfocus"], answer: "onclick" }
    ],
    finalTask: "Create a fully functional shopping cart checkout script in vanilla JS that handles product counts, tax calculations, voucher discount applications, and updates the DOM dynamically."
  },
  REACT: {
    videoTitle: "React JS Full Course",
    videoUrl: "https://www.youtube.com/embed/Ke90Tje7VS0",
    topics: [
      { name: "Components, Virtual DOM, and JSX", content: "React is a declarative JS library for UI. It compiles XML-like JSX tags into raw JS logic. Instead of direct DOM interactions, React uses a lightweight Virtual DOM to calculate diffs and perform batched, efficient reconciliation updates on the browser viewport." },
      { name: "State, Props, and Lifecycle Hooks", content: "Props are read-only variables passed down to children, while State represents internal component memory updated via useState. Hooks let components tap into lifecycles (useEffect for side effects, API requests, and cleanup logic) and store coordinates dynamically." },
      { name: "Forms, Controlled Inputs, and Event Handlers", content: "Controlled inputs link form inputs to component state. Binding input values to state variables and updating them via onChange handlers ensures that React maintains a single source of truth, enabling robust real-time validation and conditional error display." },
      { name: "React Router, Routing and URL Params", content: "Single Page Apps (SPAs) use routing libraries like React Router to swap views. Routes map url paths to components, using URL params (useParams()) to capture resource identifiers and pass them down to API fetch components." }
    ],
    assignments: [
      { title: "Task 1: Build a Controlled Form Component", description: "Create a login form where email and password parameters are stored in React state, validating entry conditions before submit." },
      { title: "Task 2: Implement a Search Filter List", description: "Pass a list of items down as props and render a subset that matches user filter characters typed in an input search bar." },
      { title: "Task 3: Fetch API Data Inside useEffect", description: "Use the useEffect hook to fetch user profiles from a placeholder endpoint, managing loading and error states in the view." },
      { title: "Task 4: Write a Dynamic Theme Switcher Component", description: "Create a custom context provider that shares the current theme style across children components on toggle click." },
      { title: "Task 5: Route Views with Navigation Params", description: "Set up route boundaries to dynamically render course viewports based on URL parameters captured by useParams." }
    ],
    quiz: [
      { question: "What hook is used to perform side-effects in React components?", options: ["useState", "useContext", "useEffect", "useMemo"], answer: "useEffect" },
      { question: "How do you pass data from a parent component to a child?", options: ["Using state", "Using context only", "Using props", "Using localStorage"], answer: "Using props" },
      { question: "What is the correct way to update a state variable named count in React?", options: ["count = count + 1", "setCount(count + 1)", "updateCount(count)", "count.update(1)"], answer: "setCount(count + 1)" },
      { question: "Which feature determines component layout updates in React by calculating differences?", options: ["Virtual DOM", "Real DOM", "Shadow DOM", "Dynamic DOM"], answer: "Virtual DOM" },
      { question: "What is the purpose of the key prop in React lists?", options: ["To style elements", "To help identify which items have changed", "To assign IDs to elements", "To bind events"], answer: "To help identify which items have changed" }
    ],
    finalTask: "Design and code a fully functional task-manager single page application (SPA) in React containing list additions, status toggles, query filters, and route-based task details."
  },
  NODE: {
    videoTitle: "Node.js Full Course",
    videoUrl: "https://www.youtube.com/embed/j55f1cIUXxs",
    topics: [
      { name: "Event Loop, Core Modules, and Node Basics", content: "Node.js is an open-source, cross-platform runtime environment executing JS code on servers. It uses an event-driven, non-blocking I/O model supported by the V8 engine and libuv. Core modules like fs (file system), path, and http allow building custom network servers directly." },
      { name: "Express Router, Routing and Request Pipeline", content: "Express is a fast, unopinionated framework for Node.js. It simplifies routing using Express Router to map HTTP requests (GET, POST, PUT, DELETE) to callback functions, parsing parameters from query strings, headers, and request bodies." },
      { name: "Middleware Functions and Error Handlers", content: "Middleware functions execute sequentially in the request-response pipeline. They parse JSON headers (express.json()), validate user tokens, and capture operational exceptions using custom error handler functions that format and send standard API responses." },
      { name: "RESTful API Integration with Express", content: "REST APIs communicate using HTTP protocols. Controllers handle client inputs, interact with models to fetch/mutate data tables, and return standardized JSON objects including status codes (200 OK, 201 Created, 400 Bad Request, 500 Server Error)." }
    ],
    assignments: [
      { title: "Task 1: Read and Write File Utilities", description: "Write a Node script that reads content from a source log file and writes parsed configurations to a separate JSON file." },
      { title: "Task 2: Build a Basic HTTP Node Server", description: "Use the core HTTP module to create a server that returns plain text at the root path and simple HTML templates at /about." },
      { title: "Task 3: Configure express.json Request Parser", description: "Create an Express server containing a POST endpoint that parses body contents and returns them in a formatted response." },
      { title: "Task 4: Write Authentication Validation Middleware", description: "Code a custom middleware function that validates the authorization header format, returning a 401 status on failure." },
      { title: "Task 5: Implement a Global Exception Middleware", description: "Write a central Express handler that captures system router failures and formats standard response messages for client consumers." }
    ],
    quiz: [
      { question: "Which module is used to handle file path operations in Node.js?", options: ["path", "fs", "http", "url"], answer: "path" },
      { question: "What is the command to initialize a new Node.js project?", options: ["node init", "npm start", "npm init", "npm install"], answer: "npm init" },
      { question: "What does Express.js represent?", options: ["A database management system", "A server runtime environment", "A minimalist web framework for Node.js", "A frontend UI framework"], answer: "A minimalist web framework for Node.js" },
      { question: "Which parameter in middleware is called to pass control to the next handler?", options: ["next", "send", "redirect", "continue"], answer: "next" },
      { question: "What does the res.json() method do in Express?", options: ["Parses JSON inputs", "Sends a JSON response", "Converts XML to JSON", "Configures database tables"], answer: "Sends a JSON response" }
    ],
    finalTask: "Design and build a robust Express REST API backend containing full CRUD operations for product inventory listings, complete with input validation and exception handlers."
  },
  MONGODB: {
    videoTitle: "MongoDB Tutorial for Beginners",
    videoUrl: "https://www.youtube.com/embed/excEC-P0t_8",
    topics: [
      { name: "NoSQL Architectures & Document Structure", content: "MongoDB is a document-oriented database classified under NoSQL. Data is stored in JSON-like BSON documents grouped within collections, eliminating strict schema migrations and supporting flexible, embedded nested structures." },
      { name: "Mongoose ODM Models, Schemas, & Validations", content: "Mongoose acts as an Object Document Mapper (ODM) for MongoDB in Node.js. It lets developers define schemas with specific validation rules (required, unique, default) and compile them into database models that run queries." },
      { name: "CRUD Operations, Query Filters, & Modifiers", content: "CRUD represents Create, Read, Update, and Delete. Mongoose uses methods like save(), find(), findOneAndUpdate(), and deleteOne() along with query operators ($gt, $in, $or) to filter database records." },
      { name: "Aggregation Pipelines, Joins, & Schema Indexes", content: "Aggregation frameworks process large batches of documents. Pipeline stages like $match, $group, $sort, and $lookup aggregate datasets, while indexes improve speed by bypassing full collection scans." }
    ],
    assignments: [
      { title: "Task 1: Define a User Profile Schema", description: "Write a Mongoose schema containing validation rules for email formats, name fields, and default registration timestamps." },
      { title: "Task 2: Code a Create and Read Endpoint", description: "Develop Mongoose endpoints that insert new record files and fetch them using filters like email queries." },
      { title: "Task 3: Implement Record Updates with Modifiers", description: "Use Mongoose modifiers to update specific array details inside a collection document without wiping out sibling tags." },
      { title: "Task 4: Build an Aggregation Pipeline Match", description: "Write a pipeline queries matching active users and grouping them based on department values to calculate average scoring values." },
      { title: "Task 5: Configure Index Queries for Search", description: "Apply text indexes to a collection metadata field to support query scans on description parameters." }
    ],
    quiz: [
      { question: "In what format does MongoDB store data internally?", options: ["CSV", "BSON", "SQL Tables", "XML"], answer: "BSON" },
      { question: "Which stage in the aggregation pipeline is used to filter documents?", options: ["$match", "$group", "$project", "$lookup"], answer: "$match" },
      { question: "What is Mongoose?", options: ["A database server", "An Object Document Mapper (ODM) library for MongoDB", "A SQL query builder", "A browser client extension"], answer: "An Object Document Mapper (ODM) library for MongoDB" },
      { question: "Which command inserts a single document in MongoDB?", options: ["db.collection.insert()", "db.collection.insertOne()", "db.collection.add()", "db.collection.create()"], answer: "db.collection.insertOne()" },
      { question: "What is the purpose of indexes in MongoDB?", options: ["To encrypt data storage", "To improve query execution times", "To validate document schemas", "To count collection items"], answer: "To improve query execution times" }
    ],
    finalTask: "Design and implement a multi-collection Mongoose model system (Users, Orders, Products) containing referenced joins ($lookup) and pipeline aggregation statistics."
  },
  SQL: {
    videoTitle: "SQL Tutorial for Beginners",
    videoUrl: "https://www.youtube.com/embed/HXV3zeQKqGY",
    topics: [
      { name: "Relational Database Basics & SQL Standards", content: "Relational database management systems (RDBMS) organize data tables with defined schemas. SQL (Structured Query Language) is the standard interface used to create tables, manage primary/foreign keys, and query records." },
      { name: "SELECT Queries, Conditions, & Aggregate Tools", content: "Query operators extract subsets of data. The SELECT statement retrieves columns, filtered by WHERE conditions. Aggregate functions (SUM, AVG, COUNT, MIN, MAX) consolidate rows, often grouped using GROUP BY." },
      { name: "Joins, Unions, & Sub-query Coordinates", content: "Joins combine columns from different tables based on key relations. Types include INNER JOIN, LEFT JOIN, RIGHT JOIN, and FULL JOIN. Sub-queries run nested statements to dynamically filter records." },
      { name: "Transactions, ACID Properties, & Schema Indexes", content: "Transactions bundle commands into a single unit of work. ACID properties (Atomicity, Consistency, Isolation, Durability) ensure database reliability, while indexes optimize query performance." }
    ],
    assignments: [
      { title: "Task 1: Write Create Table Commands", description: "Write SQL DDL commands to create a student registration table complete with primary keys, unique checks, and default values." },
      { title: "Task 2: Code Basic Filter Select Statements", description: "Develop SQL SELECT queries filtering active records that score above a threshold, sorted in descending order." },
      { title: "Task 3: Execute Inner and Left Join Queries", description: "Use INNER JOIN and LEFT JOIN commands to combine information from student profiles and enrolled courses tables." },
      { title: "Task 4: Write Group By Aggregations", description: "Draft SQL statements calculating average grades grouped by department IDs, filtering outcomes using HAVING clauses." },
      { title: "Task 5: Implement Transaction Rollbacks", description: "Write transactional statements block containing ROLLBACK triggers that abort changes if an error occurs during execution." }
    ],
    quiz: [
      { question: "Which SQL clause is used to filter records in a SELECT statement?", options: ["GROUP BY", "WHERE", "ORDER BY", "HAVING"], answer: "WHERE" },
      { question: "Which JOIN returns all records from the left table and matched records from the right?", options: ["INNER JOIN", "RIGHT JOIN", "LEFT JOIN", "FULL JOIN"], answer: "LEFT JOIN" },
      { question: "What does the ACID property 'Atomicity' guarantee?", options: ["All parts of a transaction succeed or all fail", "Data is consistent globally", "Transactions are isolated", "Changes are durable"], answer: "All parts of a transaction succeed or all fail" },
      { question: "Which command is used to add columns to an existing database table?", options: ["UPDATE TABLE", "ALTER TABLE", "INSERT TABLE", "CHANGE TABLE"], answer: "ALTER TABLE" },
      { question: "What does the COUNT() function do in SQL?", options: ["Adds column numeric totals", "Calculates average scores", "Counts rows matching conditions", "Finds the maximum value"], answer: "Counts rows matching conditions" }
    ],
    finalTask: "Design a relational schema containing complex tables (Users, Enrollments, Modules) and write queries compiling progress metrics using joins, grouping, and sub-queries."
  },
  PYTHON: {
    videoTitle: "Python for Beginners - Full Course",
    videoUrl: "https://www.youtube.com/embed/_uQrJ0TkZlc",
    topics: [
      { name: "Python Syntax, Variables, and Logic Flows", content: "Python is a high-level, interpreted scripting language famous for clean syntax. Variables are dynamically typed. Loop logic is implemented using 'for' and 'while' loops, governed by semantic block indentations rather than curly braces." },
      { name: "Data Structures, Collections, and Functions", content: "Core collection data structures include Lists (ordered, mutable), Tuples (ordered, immutable), Sets (unordered, unique), and Dictionaries (key-value maps). Reusable routines are defined using the 'def' keyword." },
      { name: "Object-Oriented Programming (OOP) in Python", content: "Python supports object-oriented patterns. Classes are declared with the 'class' keyword, using constructor functions (__init__) to initialize attributes and referencing instance objects via the self parameter." },
      { name: "File System I/O and Operational Modules", content: "File operations are handled cleanly using contextual block wrappers (with open() as file:). Node configurations, exceptions, and libraries (os, sys, math) are imported using import statements." }
    ],
    assignments: [
      { title: "Task 1: Parse and Filter List Elements", description: "Write a Python function that takes a list of integers and returns a new list containing only even values squared." },
      { title: "Task 2: Implement Key-Value Dictionary Lookup", description: "Create a program that parses configuration mappings in a dictionary and returns matched parameters." },
      { title: "Task 3: Code an OOP Student Progress Class", description: "Design a Class containing methods that calculate grades based on exam scores passed in during initialization." },
      { title: "Task 4: Write File Reading Log Scrapers", description: "Create a Python file parser that extracts error lines from a text log and saves them in a separate output file." },
      { title: "Task 5: Handle System Exceptions in Flows", description: "Write division functions containing try/except blocks to gracefully catch and handle zero-division errors." }
    ],
    quiz: [
      { question: "How do you define a function in Python?", options: ["function myFunc():", "def myFunc():", "void myFunc():", "create myFunc():"], answer: "def myFunc():" },
      { question: "Which Python data structure represents an ordered, immutable sequence?", options: ["List", "Dictionary", "Tuple", "Set"], answer: "Tuple" },
      { question: "What is the correct way to import a module in Python?", options: ["require('math')", "import math", "include math", "using math"], answer: "import math" },
      { question: "How are code blocks demarcated in Python?", options: ["Using curly braces", "Using square brackets", "Using indentation", "Using semicolons"], answer: "Using indentation" },
      { question: "Which method is used to add elements to the end of a List in Python?", options: ["push()", "add()", "append()", "insert()"], answer: "append()" }
    ],
    finalTask: "Build a Python CLI application containing complete local student record lookups, calculation averages, file outputs, and validation protocols."
  },
  AI: {
    videoTitle: "Artificial Intelligence Full Course",
    videoUrl: "https://www.youtube.com/embed/5nggKR36sg0",
    topics: [
      { name: "AI Basics and Machine Learning Theories", content: "AI is a broad field focused on building systems that mimic human intelligence. Machine Learning (ML) is a subset that uses data to train models. Paradigms include supervised, unsupervised, and reinforcement learning." },
      { name: "Neural Networks, Layers, & Deep Learning", content: "Deep learning models neural structures. Artificial Neural Networks (ANNs) consist of input layers, hidden layers with activation functions (ReLU, Sigmoid), and output layers that make classifications." },
      { name: "Model Training, Loss Functions, & Optimizers", content: "Training updates weights to minimize prediction errors. Loss functions measure error rates, while optimization algorithms (Gradient Descent, Adam) use gradients to update network weights." },
      { name: "Natural Language Processing (NLP) & Vision Systems", content: "NLP processes human languages (text parsing, transformers), and Vision systems analyze image structures. CNNs (Convolutional Neural Networks) extract patterns from pixel layers." }
    ],
    assignments: [
      { title: "Task 1: Map Supervised vs Unsupervised ML", description: "Write a comparative analysis outline details matching classification models to regression paradigms." },
      { title: "Task 2: Calculate Sigmoid Activation Values", description: "Implement a math script computing output coordinates of Sigmoid activation nodes based on input weights." },
      { title: "Task 3: Trace Gradient Descent Steps", description: "Develop an iterative logic tracing weights adjustments of standard loss parameters across gradient steps." },
      { title: "Task 4: Build a Simple Vector Matrix Layout", description: "Configure numerical array arrays mapping inputs to weights nodes to perform dot-product calculations." },
      { title: "Task 5: Outline NLP Tokenization Processes", description: "Draft the pipeline phases parsing sentences into tokens, removing stopwords, and performing stemming." }
    ],
    quiz: [
      { question: "What is the subset of AI that models neural network layers with multiple hidden dimensions?", options: ["Supervised ML", "Deep Learning", "Linear Regression", "Expert Systems"], answer: "Deep Learning" },
      { question: "Which activation function outputs values between 0 and 1?", options: ["ReLU", "Sigmoid", "Linear", "Tanh"], answer: "Sigmoid" },
      { question: "What optimizer adjusts weights based on gradient direction?", options: ["Loss Optimizer", "Gradient Descent", "Mean Squared Error", "K-Means"], answer: "Gradient Descent" },
      { question: "Which network architecture is commonly used for computer vision and image processing?", options: ["RNN", "LSTM", "CNN", "Transformer"], answer: "CNN" },
      { question: "In supervised learning, what does the model require?", options: ["Only inputs", "Labeled training data", "Unlabeled data", "Random weights only"], answer: "Labeled training data" }
    ],
    finalTask: "Design the architecture outline and model parameters flow for a custom neural classifier that recognizes digit objects, specifying layer nodes, activation functions, and optimizer details."
  },
  DATA_SCIENCE: {
    videoTitle: "Data Science Full Course",
    videoUrl: "https://www.youtube.com/embed/ua-CiDNNj30",
    topics: [
      { name: "Data Science Workflows & Numerical Toolkits", content: "Data Science extracts actionable insights from structured and unstructured data. Toolkits like Pandas, NumPy, and Matplotlib load datasets, clean values, handle missing items, and plot visualizations." },
      { name: "Data Manipulation & Dataframes in Pandas", content: "Pandas organizes tabular structures into DataFrames. Operations include selection, merging, grouping (groupby), and filtering, allowing analysis of multi-dimensional tables." },
      { name: "Descriptive and Inferential Statistical Models", content: "Statistics describe data properties (mean, median, standard deviation) and draw conclusions (hypothesis testing, p-values, regression lines, and correlation metrics)." },
      { name: "Data Visualization & Trend Charting", content: "Visualizing data highlights distributions and trends. Chart types include histograms, scatter plots, and box plots to show outliers and patterns." }
    ],
    assignments: [
      { title: "Task 1: Calculate Mean and Median Ranges", description: "Write functions to compute the mean, median, and mode from raw data arrays without using built-in libraries." },
      { title: "Task 2: Clean Missing Rows in DataFrames", description: "Use Pandas parameters to locate missing fields, filling cell coordinates with average group values." },
      { title: "Task 3: Execute GroupBy Aggregate Metrics", description: "Perform aggregate groupby queries compiling total sales figures sorted by region columns." },
      { title: "Task 4: Plot Histogram Range Distributions", description: "Draft chart parameters plotting data distribution curves across value intervals." },
      { title: "Task 5: Outline a A/B Test Hypothesis", description: "Specify test parameters (null hypothesis, alternative hypothesis, significance level) to validate a marketing variable change." }
    ],
    quiz: [
      { question: "Which python library is primarily used for data manipulation and tabular analysis?", options: ["NumPy", "Matplotlib", "Pandas", "Scikit-Learn"], answer: "Pandas" },
      { question: "What statistic measures the dispersion of a dataset relative to its mean?", options: ["Mean", "Median", "Standard Deviation", "Correlation"], answer: "Standard Deviation" },
      { question: "Which chart is best suited for showing correlation between two numerical variables?", options: ["Bar chart", "Pie chart", "Scatter plot", "Histogram"], answer: "Scatter plot" },
      { question: "In Pandas, what structure represents a single column of data?", options: ["DataFrame", "Series", "Array", "Matrix"], answer: "Series" },
      { question: "What is the standard value of significance level (alpha) in hypothesis tests?", options: ["0.5", "0.05", "0.95", "0.01"], answer: "0.05" }
    ],
    finalTask: "Design and implement a complete dataset cleanup and descriptive summary report analyzing student enrollment parameters, displaying statistics, and highlighting anomalies."
  },
  CLOUD: {
    videoTitle: "Cloud Computing Full Course",
    videoUrl: "https://www.youtube.com/embed/3hLmDS179YE",
    topics: [
      { name: "Introduction to Cloud Models & Core Concepts", content: "Cloud computing delivers storage, databases, servers, and software over the internet. Deployment models include public, private, and hybrid. Service layers span IaaS (Infrastructure), PaaS (Platform), and SaaS (Software)." },
      { name: "Virtual Machines, Instances, & Auto-Scaling", content: "Cloud platforms offer on-demand virtual servers (AWS EC2, GCP Compute Engine). Auto-scaling groups dynamically increase or decrease server counts based on user traffic parameters." },
      { name: "Identity & Access Management (IAM) & Policies", content: "Security in the cloud relies on Identity & Access Management. IAM policies define access permissions for user accounts and server processes using Role-Based Access Control (RBAC)." },
      { name: "Object Storage Services & CDN Deployments", content: "Cloud storage provides scalable file systems (AWS S3, GCP Cloud Storage) to store static assets. Content Delivery Networks (CDNs) cache files globally for faster delivery." }
    ],
    assignments: [
      { title: "Task 1: Contrast SaaS, PaaS, and IaaS Layers", description: "Draft a comparative matrix matching common cloud platforms to their respective service categories." },
      { title: "Task 2: Write custom JSON IAM Policies", description: "Create a policy document that grants read-only permissions to an object storage bucket while denying write actions." },
      { title: "Task 3: Design a CDN Deployment Diagram", description: "Outline the routing flow from browser requests to edge locations and origin servers during asset retrieval." },
      { title: "Task 4: Calculate Auto-Scaling Trigger Metrics", description: "Determine scale-out parameters based on CPU utilization metrics and cooldown thresholds." },
      { title: "Task 5: Configure Virtual Networks (VPC)", description: "Specify subnet IP ranges and route tables to isolate server instances inside a secure virtual cloud." }
    ],
    quiz: [
      { question: "Which cloud service model provides virtual servers, storage, and networking directly to users?", options: ["SaaS", "PaaS", "IaaS", "DBaaS"], answer: "IaaS" },
      { question: "What feature dynamically scales cloud instances based on resource demands?", options: ["Load balancing", "Auto-scaling", "CDN caching", "Virtual Private Cloud"], answer: "Auto-scaling" },
      { question: "What is the role of IAM in cloud environments?", options: ["To accelerate image downloads", "To manage identities and access permissions", "To host relational databases", "To monitor server CPU metrics"], answer: "To manage identities and access permissions" },
      { question: "Which of the following is an object storage service in AWS?", options: ["EC2", "RDS", "S3", "VPC"], answer: "S3" },
      { question: "What does a CDN do?", options: ["Performs database queries", "Caches static assets closer to users globally", "Spawns virtual machine instances", "Encrypts backup datasets"], answer: "Caches static assets closer to users globally" }
    ],
    finalTask: "Design a high-availability, secure cloud architecture containing load balancers, auto-scaled compute groups, secure subnets, and object storage assets."
  },
  CYBER_SECURITY: {
    videoTitle: "Cyber Security Full Course for Beginners",
    videoUrl: "https://www.youtube.com/embed/PlHnamdwGmw",
    topics: [
      { name: "Threat landscapes, Vulnerabilities, & Malware Types", content: "Cyber security protects networks and systems from digital attacks. Threats range from social engineering (phishing) to malware (ransomware, trojans, spyware) and network-level attacks." },
      { name: "Symmetric, Asymmetric Encryption & Keys", content: "Cryptography secures communications. Symmetric cryptography uses a single shared key, whereas asymmetric cryptography uses public keys to encrypt and private keys to decrypt data." },
      { name: "Network Firewalls, Intrusion Detection & Access", content: "Network security shields systems using firewalls (packet filtering) and Intrusion Detection Systems (IDS/IPS) that monitor traffic and block malicious signatures." },
      { name: "Ethical Hacking, Penetration Testing & OWASP Top 10", content: "Ethical hacking identifies weaknesses before malicious attackers can exploit them, following guidelines like the OWASP Top 10 (SQL Injection, Cross-Site Scripting)." }
    ],
    assignments: [
      { title: "Task 1: Outline OWASP SQL Injection Patches", description: "Write pseudocode implementations using parameterized statements to prevent database injection exploits." },
      { title: "Task 2: Diagram Asymmetric Cryptography Flows", description: "Create a flow diagram displaying public/private key exchanges during a secure email transmission." },
      { title: "Task 3: Classify Phishing Attack Vectors", description: "Analyze a sample phishing email, highlighting red flags like domains, links, and urgent language." },
      { title: "Task 4: Write Custom Firewall Rules", description: "Draft firewall rules that block incoming traffic on port 22 (SSH) except from a trusted IP address." },
      { title: "Task 5: Define Password Hashing Schemes", description: "Compare salting and hashing protocols, detailing how bcrypt protects stored credentials." }
    ],
    quiz: [
      { question: "Which encryption type uses a public key to encrypt and a separate private key to decrypt?", options: ["Symmetric", "Asymmetric", "AES", "Hashing"], answer: "Asymmetric" },
      { question: "What type of attack attempts to trick users into sharing sensitive credentials via fake emails?", options: ["DDoS", "SQL Injection", "Phishing", "Man-in-the-Middle"], answer: "Phishing" },
      { question: "Which port is standard for secure shell (SSH) access?", options: ["80", "443", "22", "21"], answer: "22" },
      { question: "What is OWASP primarily known for?", options: ["A hardware firewall appliance", "Publishing standards for web application security", "A cloud hosting platform", "Designing encryption chips"], answer: "Publishing standards for web application security" },
      { question: "What does adding a 'salt' to a password hash accomplish?", options: ["Encrypts the password", "Protects against rainbow table lookup attacks", "Shortens hash strings", "Decrypts the hash values"], answer: "Protects against rainbow table lookup attacks" }
    ],
    finalTask: "Develop an organizational cybersecurity checklist and incident response plan detailing threat isolation, containment, and backup recovery protocols."
  },
  COMMUNICATION: {
    videoTitle: "Communication Skills Training",
    videoUrl: "https://www.youtube.com/embed/HAnw168huqA",
    topics: [
      { name: "Active Listening & Effective Feedback Loop Systems", content: "Effective communication starts with listening. Active listening requires paying full attention, asking clarifying questions, and mirroring statements to confirm understanding before responding." },
      { name: "Verbal Articulation & Non-verbal Cues", content: "Speech delivery is shaped by non-verbal cues. Body language, eye contact, and tone of voice reinforce or contradict verbal messages during presentations." },
      { name: "Written Business Communication & Email Formats", content: "Professional writing is concise, clear, and structured. Business emails use clear subject lines, formal greetings, bulleted action items, and professional signatures." },
      { name: "Presentation Structures & Audience Engagement", content: "Successful presentations grab attention immediately. Presenters structure slides logically and engage audiences using interactive questions and stories." }
    ],
    assignments: [
      { title: "Task 1: Draft an Active Listening Scenario", description: "Write a mock dialog between a manager and a client, using active listening techniques to resolve a dispute." },
      { title: "Task 2: Refactor a Casual Message to Professional", description: "Convert a casual text request into a formal, structured business email requesting project resources." },
      { title: "Task 3: Outline a Presentation Slide Deck", description: "Create a 5-slide presentation outline introducing a product, detailing slide objectives and key takeaways." },
      { title: "Task 4: Identify Common Non-verbal Barriers", description: "Analyze body language patterns that express defensiveness or disinterest during group meetings." },
      { title: "Task 5: Draft a Project Progress Summary", description: "Write a short status update email summarizing key accomplishments, blockers, and next steps for team leads." }
    ],
    quiz: [
      { question: "What is the first step in active listening?", options: ["Formulating your reply", "Paying absolute attention and avoiding interruptions", "Offering advice", "Summarizing your credentials"], answer: "Paying absolute attention and avoiding interruptions" },
      { question: "Which element of a business email is most critical for grab attention?", options: ["A descriptive subject line", "The signature block", "Detailed attachments", "A colorful header design"], answer: "A descriptive subject line" },
      { question: "What does body language represent in face-to-face communication?", options: ["Verbal articulation", "Non-verbal cues", "Active feedback", "Audience retention"], answer: "Non-verbal cues" },
      { question: "How should professional business writing be structured?", options: ["Conversational and long", "Clear, concise, and action-oriented", "Technical and abstract", "Vague and casual"], answer: "Clear, concise, and action-oriented" },
      { question: "What does mirroring accomplish in dialogs?", options: ["Interrupts speakers", "Confirms mutual understanding of statements", "Defines meeting agendas", "Shortens conversations"], answer: "Confirms mutual understanding of statements" }
    ],
    finalTask: "Design and record a comprehensive team meeting communication plan outlining agenda templates, feedback loops, and action tracker updates."
  },
  APTITUDE: {
    videoTitle: "Quantitative Aptitude Course",
    videoUrl: "https://www.youtube.com/embed/O8d6GfR2_j0",
    topics: [
      { name: "Quantitative Reasoning & Percentages", content: "Aptitude assessments measure problem-solving speed. Topics include percentage changes, ratios, rates, and fractions to solve business and resource allocation challenges." },
      { name: "Time, Speed, Distance, & Work Metrics", content: "Motion equations relate velocity to time and distance. Work metrics compute combined team completion rates using mathematical formulas." },
      { name: "Logical Deduction & Data Interpretation", content: "Data interpretation evaluates charts and tables. Logical deduction analyzes patterns, sequences, and truth tables to draw conclusions." },
      { name: "Verbal Reasoning & Comprehension Analysis", content: "Verbal aptitude tests vocabulary and critical thinking. Comprehension exercises require analyzing short passages to identify implicit assumptions." }
    ],
    assignments: [
      { title: "Task 1: Calculate Weighted Interest Averages", description: "Solve a series of percentage growth problems tracking interest rates and compound yield averages." },
      { title: "Task 2: Solve Time and Speed Word Problems", description: "Calculate travel time for two trains moving toward each other at different velocities." },
      { title: "Task 3: Interpret tabular Sales Chart Metrics", description: "Analyze a sales performance table, calculating percentage changes across years." },
      { title: "Task 4: Deduce Sequence and Pattern Values", description: "Identify the mathematical rule governing a sequence of number matrices." },
      { title: "Task 5: Analyze Verbal Arguments and Fallacies", description: "Identify logical fallacies in a series of promotional slogans." }
    ],
    quiz: [
      { question: "If a train travels at 60 km/h, how long does it take to cover 150 km?", options: ["2 hours", "2.5 hours", "3 hours", "1.5 hours"], answer: "2.5 hours" },
      { question: "An item costs $80 after a 20% discount. What was the original price?", options: ["$100", "$96", "$110", "$90"], answer: "$100" },
      { question: "If 3 workers can complete a task in 6 days, how long will it take 9 workers?", options: ["2 days", "3 days", "1.8 days", "4 days"], answer: "2 days" },
      { question: "Identify the next number in the sequence: 2, 4, 8, 16, ...", options: ["20", "24", "32", "64"], answer: "32" },
      { question: "Which statistic represents the ratio of successes to total attempts?", options: ["Percentage rate", "Standard deviation", "Mode", "Average distribution"], answer: "Percentage rate" }
    ],
    finalTask: "Complete a full 10-question logical reasoning and numerical problem set, documenting the formulas and deductions used to solve each problem."
  },
  SOFT_SKILLS: {
    videoTitle: "Soft Skills Training & Development",
    videoUrl: "https://www.youtube.com/embed/yP7S5Gj0XjQ",
    topics: [
      { name: "Team Dynamics & Collaboration Models", content: "Soft skills are key interpersonal traits. Successful teams depend on collaboration, trust, active communication, and conflict resolution mechanisms." },
      { name: "Leadership Qualities & Decision Pipelines", content: "Effective leaders inspire, delegate tasks, and take accountability. Decision pipelines use objective evaluation metrics to make sound business decisions." },
      { name: "Time Management, Prioritization & Eisenhower Matrix", content: "Time management relies on prioritizing tasks. The Eisenhower Matrix groups tasks by urgency and importance to help professionals focus on what matters." },
      { name: "Conflict Resolution & Emotional Intelligence", content: "Conflict resolution uses empathy and active listening to settle disagreements. High emotional intelligence (EQ) helps professionals navigate social dynamics smoothly." }
    ],
    assignments: [
      { title: "Task 1: Map the Eisenhower Matrix", description: "Categorize 5 common workplace tasks into the Eisenhower Matrix quadrants, outlining action strategies." },
      { title: "Task 2: Write a Conflict Resolution Script", description: "Create a dialogue where two team members resolve a disagreement over code guidelines." },
      { title: "Task 3: Outline Team Delegation Strategies", description: "Design a delegation matrix for a project, assigning tasks based on team members' skills." },
      { title: "Task 4: Identify Key EQ Attributes", description: "Write case examples illustrating empathy, self-awareness, and motivation in the workplace." },
      { title: "Task 5: Build a Weekly Time Tracker Log", description: "Create a time-blocking schedule that allocates hours for deep work, meetings, and breaks." }
    ],
    quiz: [
      { question: "Which quadrant of the Eisenhower Matrix represents urgent and important tasks?", options: ["Quadrant 1: Do First", "Quadrant 2: Schedule", "Quadrant 3: Delegate", "Quadrant 4: Eliminate"], answer: "Quadrant 1: Do First" },
      { question: "What is emotional intelligence (EQ)?", options: ["High IQ score", "The ability to recognize and manage emotions", "Speed reading skills", "Advanced coding expertise"], answer: "The ability to recognize and manage emotions" },
      { question: "How is conflict best resolved in collaborative teams?", options: ["By ignoring differences", "Through open, empathetic dialogue and active listening", "By enforcing management decisions without discussion", "Through email arguments"], answer: "Through open, empathetic dialogue and active listening" },
      { question: "What does the delegation of tasks accomplish?", options: ["Increases manager workload", "Empowers team members and builds trust", "Avoids project deadlines", "Lowers project quality"], answer: "Empowers team members and builds trust" },
      { question: "Which skill is most critical for successful team dynamics?", options: ["Solitary programming", "Active collaboration and communication", "Rote memorization", "Aggressive debate"], answer: "Active collaboration and communication" }
    ],
    finalTask: "Design and draft a comprehensive team culture charter that defines communication rules, core values, and conflict resolution guidelines."
  },
  INTERVIEW_PREP: {
    videoTitle: "How to Ace a Technical Interview",
    videoUrl: "https://www.youtube.com/embed/K95lK6k9630",
    topics: [
      { name: "Resume Building & Professional Branding", content: "A professional resume highlights impact, technical skills, and projects. Portfolios and platforms like LinkedIn establish your professional brand." },
      { name: "Behavioral Questions & The STAR Method", content: "Behavioral questions evaluate soft skills. The STAR method structures answers by explaining the Situation, Task, Action, and Result." },
      { name: "Technical Interview Formats & Coding Rounds", content: "Technical interviews assess coding, system design, and algorithms. Candidates should talk through their problem-solving process out loud." },
      { name: "Salary Negotiation & Post-Interview Protocols", content: "Negotiation requires research and professional phrasing. Following up with polite thank-you notes reinforces your interest in the role." }
    ],
    assignments: [
      { title: "Task 1: Draft a STAR Method Answer", description: "Write a response to 'Tell me about a time you resolved a technical bug' using the STAR format." },
      { title: "Task 2: Optimize a Resume Summary Section", description: "Refactor a resume summary, highlighting key metrics, technologies, and achievements." },
      { title: "Task 3: Document a Coding Solution Out Loud", description: "Write a step-by-step walkthrough explaining your approach to a reverse-string coding challenge." },
      { title: "Task 4: Write a Post-Interview Thank You Email", description: "Draft a concise thank-you email to send to hiring managers within 24 hours of an interview." },
      { title: "Task 5: Outline Salary Negotiation Rebuttals", description: "Prepare professional scripts to negotiate a salary offer based on market averages." }
    ],
    quiz: [
      { question: "What does the 'R' stand for in the STAR method for behavioral answers?", options: ["Reaction", "Result", "Role", "Resource"], answer: "Result" },
      { question: "Which section of a resume should be most prominent for a developer role?", options: ["Interests", "Technical Skills and Projects", "References", "Formal Cover Letter Page"], answer: "Technical Skills and Projects" },
      { question: "What is the recommended timeframe to send a post-interview follow-up email?", options: ["Within 24 hours", "After 1 week", "Immediately inside the call", "Within 1 month"], answer: "Within 24 hours" },
      { question: "What should you do during a technical coding round?", options: ["Code in absolute silence", "Explain your thought process out loud", "Memorize raw solutions", "Refuse to use helper variables"], answer: "Explain your thought process out loud" },
      { question: "How should salary negotiation be initiated?", options: ["Assertively demanding a figure", "Politely asking based on market research and value", "Accepting the first offer immediately", "Refusing to speak about benefits"], answer: "Politely asking based on market research and value" }
    ],
    finalTask: "Design a comprehensive personal portfolio site wireframe containing landing bio, skills index, active project grids, and STAR question templates."
  }
};

export const generateQuiz = (courseTitle) => {
  const quizBank = {
    "HTML": [
      { id: 1, question: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Markup Language", "None"], answer: "Hyper Text Markup Language" },
      { id: 2, question: "Which tag creates a hyperlink?", options: ["<link>", "<a>", "<href>", "<url>"], answer: "<a>" },
      { id: 3, question: "Which HTML element defines the document body?", options: ["<main>", "<section>", "<body>", "<content>"], answer: "<body>" },
      { id: 4, question: "What attribute specifies an alternate text for an image?", options: ["title", "src", "alt", "href"], answer: "alt" },
      { id: 5, question: "Which tag is used for the largest heading?", options: ["<h6>", "<h1>", "<head>", "<header>"], answer: "<h1>" },
    ],
    "CSS": [
      { id: 1, question: "What does CSS stand for?", options: ["Cascading Style Sheets", "Computer Style Sheets", "Creative Style System", "Colorful Style Sheets"], answer: "Cascading Style Sheets" },
      { id: 2, question: "Which property sets the text color?", options: ["font-color", "text-color", "color", "foreground"], answer: "color" },
      { id: 3, question: "What does 'display: flex' do?", options: ["Hides the element", "Makes element flexible container", "Adds animation", "Centers text"], answer: "Makes element flexible container" },
      { id: 4, question: "Which unit is relative to the viewport width?", options: ["px", "em", "rem", "vw"], answer: "vw" },
      { id: 5, question: "Which property creates space inside an element's border?", options: ["margin", "spacing", "padding", "border-space"], answer: "padding" },
    ],
    "JavaScript": [
      { id: 1, question: "Which keyword declares a block-scoped variable?", options: ["var", "let", "define", "set"], answer: "let" },
      { id: 2, question: "What does DOM stand for?", options: ["Document Object Model", "Data Object Management", "Display Output Mode", "Document Oriented Markup"], answer: "Document Object Model" },
      { id: 3, question: "Which method adds an item to the end of an array?", options: ["push()", "pop()", "shift()", "append()"], answer: "push()" },
      { id: 4, question: "What is a Promise in JavaScript?", options: ["A loop construct", "An object for async operations", "A CSS function", "A variable type"], answer: "An object for async operations" },
      { id: 5, question: "Which ES6 feature allows default parameter values?", options: ["Arrow functions", "Destructuring", "Default parameters", "Template literals"], answer: "Default parameters" },
    ],
    "React": [
      { id: 1, question: "What is JSX?", options: ["A JavaScript library", "A syntax extension for JavaScript", "A CSS framework", "A database language"], answer: "A syntax extension for JavaScript" },
      { id: 2, question: "Which hook manages state in a functional component?", options: ["useEffect", "useRef", "useState", "useContext"], answer: "useState" },
      { id: 3, question: "What are props in React?", options: ["Internal component state", "CSS properties", "Data passed from parent to child", "Event handlers"], answer: "Data passed from parent to child" },
      { id: 4, question: "Which hook runs side effects in React?", options: ["useState", "useEffect", "useMemo", "useRef"], answer: "useEffect" },
      { id: 5, question: "What is the virtual DOM?", options: ["A browser feature", "A lightweight copy of the real DOM", "A CSS rendering engine", "A JavaScript engine"], answer: "A lightweight copy of the real DOM" },
    ],
    "Node.js": [
      { id: 1, question: "What is Node.js?", options: ["A frontend framework", "A JavaScript runtime built on Chrome's V8 engine", "A database", "A CSS preprocessor"], answer: "A JavaScript runtime built on Chrome's V8 engine" },
      { id: 2, question: "Which module handles file operations in Node.js?", options: ["http", "path", "fs", "os"], answer: "fs" },
      { id: 3, question: "What is npm?", options: ["Node Package Manager", "New Programming Method", "Node Process Manager", "None"], answer: "Node Package Manager" },
      { id: 4, question: "Which method creates an HTTP server in Node.js?", options: ["http.create()", "http.createServer()", "server.create()", "node.server()"], answer: "http.createServer()" },
      { id: 5, question: "What is middleware in Express.js?", options: ["A database layer", "Functions that execute during request-response cycle", "A routing algorithm", "A template engine"], answer: "Functions that execute during request-response cycle" },
    ],
    "Python": [
      { id: 1, question: "What is Python?", options: ["A markup language", "A high-level programming language", "A database system", "A CSS framework"], answer: "A high-level programming language" },
      { id: 2, question: "Which keyword defines a function in Python?", options: ["function", "def", "func", "define"], answer: "def" },
      { id: 3, question: "What data type is [1, 2, 3] in Python?", options: ["Tuple", "Dictionary", "Set", "List"], answer: "List" },
      { id: 4, question: "Which operator is used for exponentiation?", options: ["^", "**", "%%", "//"], answer: "**" },
      { id: 5, question: "What does 'self' refer to in a Python class?", options: ["The parent class", "The class itself", "The current instance", "A static method"], answer: "The current instance" },
    ],
    "MongoDB": [
      { id: 1, question: "What type of database is MongoDB?", options: ["Relational", "NoSQL", "Graph", "Columnar"], answer: "NoSQL" },
      { id: 2, question: "What is a collection in MongoDB?", options: ["A table equivalent", "A row equivalent", "A column equivalent", "A schema"], answer: "A table equivalent" },
      { id: 3, question: "Which method inserts a document in MongoDB?", options: ["insertDoc()", "insertOne()", "addDocument()", "pushDoc()"], answer: "insertOne()" },
      { id: 4, question: "What format does MongoDB store data in?", options: ["XML", "CSV", "BSON/JSON", "SQL"], answer: "BSON/JSON" },
      { id: 5, question: "Which operator filters documents in MongoDB?", options: ["WHERE", "$match", "FILTER", "SELECT"], answer: "$match" },
    ],
    "SQL": [
      { id: 1, question: "What does SQL stand for?", options: ["Structured Query Language", "Simple Query Logic", "Standard Query List", "None"], answer: "Structured Query Language" },
      { id: 2, question: "Which SQL clause filters records?", options: ["ORDER BY", "GROUP BY", "WHERE", "HAVING"], answer: "WHERE" },
      { id: 3, question: "Which JOIN returns all rows from both tables?", options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"], answer: "FULL OUTER JOIN" },
      { id: 4, question: "Which command removes a table permanently?", options: ["DELETE", "REMOVE", "DROP", "TRUNCATE"], answer: "DROP" },
      { id: 5, question: "Which aggregate function returns the highest value?", options: ["SUM()", "AVG()", "MIN()", "MAX()"], answer: "MAX()" },
    ],
    "AI": [
      { id: 1, question: "What does AI stand for?", options: ["Automated Interface", "Artificial Intelligence", "Algorithmic Input", "Advanced Integration"], answer: "Artificial Intelligence" },
      { id: 2, question: "What is supervised learning?", options: ["Learning without labels", "Learning with labeled data", "Unsupervised clustering", "Reinforcement training"], answer: "Learning with labeled data" },
      { id: 3, question: "What is a neural network?", options: ["A computer network", "A biological brain replica", "A system of interconnected nodes inspired by the brain", "A database system"], answer: "A system of interconnected nodes inspired by the brain" },
      { id: 4, question: "What is overfitting in ML?", options: ["Model performs well on all data", "Model memorizes training data but fails on new data", "Model underfits training data", "Model has too few parameters"], answer: "Model memorizes training data but fails on new data" },
      { id: 5, question: "Which algorithm is used for classification?", options: ["Linear Regression", "K-Means", "Decision Tree", "PCA"], answer: "Decision Tree" },
    ],
    "Data Science": [
      { id: 1, question: "Which library is used for data manipulation in Python?", options: ["NumPy", "Pandas", "Matplotlib", "Scikit-learn"], answer: "Pandas" },
      { id: 2, question: "What is a DataFrame?", options: ["A 1D array", "A 2D labeled data structure", "A database table", "A Python dictionary"], answer: "A 2D labeled data structure" },
      { id: 3, question: "Which chart shows data distribution?", options: ["Bar chart", "Pie chart", "Histogram", "Line chart"], answer: "Histogram" },
      { id: 4, question: "What does EDA stand for?", options: ["Extended Data Analysis", "Exploratory Data Analysis", "External Data Access", "Encoded Data Array"], answer: "Exploratory Data Analysis" },
      { id: 5, question: "Which metric measures model accuracy for regression?", options: ["Accuracy", "F1 Score", "RMSE", "Precision"], answer: "RMSE" },
    ],
    "Cloud Computing": [
      { id: 1, question: "What is cloud computing?", options: ["Local server hosting", "Delivery of computing services over the internet", "A programming language", "A database type"], answer: "Delivery of computing services over the internet" },
      { id: 2, question: "What does IaaS stand for?", options: ["Internet as a Service", "Infrastructure as a Service", "Integration as a Service", "Interface as a Service"], answer: "Infrastructure as a Service" },
      { id: 3, question: "Which is a major cloud provider?", options: ["Oracle DB", "AWS", "MongoDB", "Redis"], answer: "AWS" },
      { id: 4, question: "What is auto-scaling?", options: ["Manual server management", "Automatically adjusting resources based on demand", "A billing feature", "A storage type"], answer: "Automatically adjusting resources based on demand" },
      { id: 5, question: "What is a CDN?", options: ["Cloud Data Network", "Content Delivery Network", "Central Database Node", "Core Distribution Network"], answer: "Content Delivery Network" },
    ],
    "Cyber Security": [
      { id: 1, question: "What is phishing?", options: ["A network protocol", "A fraudulent attempt to steal credentials", "A type of encryption", "A firewall rule"], answer: "A fraudulent attempt to steal credentials" },
      { id: 2, question: "What does VPN stand for?", options: ["Virtual Private Network", "Verified Public Node", "Virtual Protocol Network", "Volatile Private Node"], answer: "Virtual Private Network" },
      { id: 3, question: "What is two-factor authentication?", options: ["Logging in with two passwords", "A security layer requiring two forms of verification", "Encrypting data twice", "Using two browsers"], answer: "A security layer requiring two forms of verification" },
      { id: 4, question: "What is a firewall?", options: ["A physical barrier", "A network security system monitoring traffic", "An antivirus program", "A password manager"], answer: "A network security system monitoring traffic" },
      { id: 5, question: "What does SQL injection exploit?", options: ["CSS vulnerabilities", "Unvalidated database queries", "Network protocols", "API tokens"], answer: "Unvalidated database queries" },
    ],
    "Communication": [
      { id: 1, question: "What is active listening?", options: ["Hearing background sounds", "Fully concentrating on what is being said", "Interrupting frequently", "Multitasking while listening"], answer: "Fully concentrating on what is being said" },
      { id: 2, question: "Which is a barrier to effective communication?", options: ["Clarity", "Empathy", "Noise", "Feedback"], answer: "Noise" },
      { id: 3, question: "What is non-verbal communication?", options: ["Written messages", "Body language and gestures", "Spoken words", "Email"], answer: "Body language and gestures" },
      { id: 4, question: "What does assertive communication mean?", options: ["Being aggressive", "Being passive", "Expressing thoughts clearly and respectfully", "Avoiding conflict"], answer: "Expressing thoughts clearly and respectfully" },
      { id: 5, question: "Which element is key to a good presentation?", options: ["Length", "Reading from slides", "Audience engagement", "Technical jargon"], answer: "Audience engagement" },
    ],
    "Soft Skills": [
      { id: 1, question: "What is emotional intelligence?", options: ["IQ measurement", "Ability to understand and manage emotions", "A technical skill", "A communication barrier"], answer: "Ability to understand and manage emotions" },
      { id: 2, question: "Which skill is most important for teamwork?", options: ["Speed", "Collaboration", "Individual performance", "Competition"], answer: "Collaboration" },
      { id: 3, question: "What is time management?", options: ["Working overtime", "Organizing tasks to use time effectively", "Multitasking constantly", "Avoiding deadlines"], answer: "Organizing tasks to use time effectively" },
      { id: 4, question: "What does adaptability mean?", options: ["Refusing change", "Adjusting effectively to new situations", "Following strict routines", "Avoiding challenges"], answer: "Adjusting effectively to new situations" },
      { id: 5, question: "Which is a key leadership quality?", options: ["Micromanaging", "Inspiring and motivating others", "Working alone", "Avoiding decisions"], answer: "Inspiring and motivating others" },
    ],
    "Interview Preparation": [
      { id: 1, question: "What is the STAR method?", options: ["A grading system", "Situation Task Action Result framework", "A resume format", "A coding technique"], answer: "Situation Task Action Result framework" },
      { id: 2, question: "What should you research before an interview?", options: ["Interviewer's personal life", "Company background and role requirements", "Competitor salaries", "Office layout"], answer: "Company background and role requirements" },
      { id: 3, question: "What is a common behavioral interview question?", options: ["What is your GPA?", "Describe a challenge you overcame", "What is your age?", "Do you have a car?"], answer: "Describe a challenge you overcame" },
      { id: 4, question: "What is appropriate interview attire?", options: ["Casual wear", "Professional or business casual clothing", "Sports clothing", "Pajamas"], answer: "Professional or business casual clothing" },
      { id: 5, question: "What should you do after an interview?", options: ["Wait indefinitely", "Send a thank-you email within 24 hours", "Call every hour", "Nothing"], answer: "Send a thank-you email within 24 hours" },
    ],
  };

  const matchedKey = Object.keys(quizBank).find(key =>
    courseTitle?.toLowerCase().includes(key.toLowerCase()) ||
    key.toLowerCase().includes(courseTitle?.toLowerCase())
  );

  return matchedKey ? quizBank[matchedKey] : [];
};

export const generateFinalAssignment = (courseTitle) => {
  const assignmentBank = {
    "HTML": {
      title: "HTML Portfolio Website",
      description: "Build a complete personal portfolio website using semantic HTML5 elements. Include navigation, about section, projects section, and contact form. Ensure accessibility compliance.",
      requirements: ["Use semantic HTML5 tags", "Include at least 5 pages", "Add a contact form", "Ensure WCAG accessibility", "Valid HTML structure"],
      deliverable: "Upload your HTML files or share a GitHub repository link."
    },
    "CSS": {
      title: "Responsive UI Design Project",
      description: "Design and build a fully responsive web interface using pure CSS. Implement flexbox, CSS grid, animations, and media queries for mobile-first design.",
      requirements: ["Mobile-first responsive design", "Use CSS Grid and Flexbox", "Include CSS animations", "Cross-browser compatible", "No external CSS frameworks"],
      deliverable: "Upload your CSS project files or share a live demo link."
    },
    "JavaScript": {
      title: "Interactive JavaScript Application",
      description: "Build a fully functional interactive JavaScript application. Implement DOM manipulation, event handling, async API calls, and ES6+ features.",
      requirements: ["Use ES6+ features", "Implement async/await", "DOM manipulation", "Handle API integration", "Error handling"],
      deliverable: "Upload your JS project or share a GitHub link."
    },
    "React": {
      title: "Full React Application",
      description: "Build a complete React application using functional components, hooks, props, state management, and React Router. Application must have multiple pages and real data.",
      requirements: ["Functional components with hooks", "State management with useState/useReducer", "React Router navigation", "API integration", "Responsive design"],
      deliverable: "Upload your React project or share a GitHub repository link."
    },
    "Node.js": {
      title: "RESTful API Backend",
      description: "Build a complete RESTful API using Node.js and Express. Implement CRUD operations, middleware, authentication, and database integration.",
      requirements: ["Express.js server setup", "RESTful API routes", "JWT authentication", "Database integration", "Error handling middleware"],
      deliverable: "Upload your Node.js project or share a GitHub repository link."
    },
    "Python": {
      title: "Python Automation or Web Application",
      description: "Build a Python application that solves a real-world problem. Use OOP principles, file handling, and external libraries.",
      requirements: ["OOP implementation", "File I/O operations", "Use of external libraries", "Error handling", "Clean code structure"],
      deliverable: "Upload your Python project or share a GitHub repository link."
    },
    "MongoDB": {
      title: "MongoDB Database Design Project",
      description: "Design and implement a complete MongoDB database for a real-world application. Include CRUD operations, aggregation pipelines, and indexing.",
      requirements: ["Schema design", "CRUD operations", "Aggregation pipeline", "Indexing for performance", "Data validation"],
      deliverable: "Upload your MongoDB project files or share a GitHub repository link."
    },
    "SQL": {
      title: "Database Management System Project",
      description: "Design a relational database for a business use case. Implement tables, relationships, complex queries, stored procedures, and indexes.",
      requirements: ["Entity-relationship design", "Complex JOIN queries", "Stored procedures", "Indexes for performance", "Data normalization"],
      deliverable: "Upload your SQL scripts or share a GitHub repository link."
    },
    "AI": {
      title: "AI/ML Model Implementation",
      description: "Build and train a machine learning model for a real-world problem. Include data preprocessing, model selection, training, evaluation, and deployment.",
      requirements: ["Data preprocessing", "Model selection and training", "Performance evaluation", "Hyperparameter tuning", "Model deployment or demo"],
      deliverable: "Upload your Jupyter notebook or share a GitHub repository link."
    },
    "Data Science": {
      title: "End-to-End Data Analysis Project",
      description: "Perform a complete data analysis on a real dataset. Include data cleaning, exploratory analysis, visualization, and insights presentation.",
      requirements: ["Data cleaning with Pandas", "Exploratory data analysis", "Visualization with Matplotlib/Seaborn", "Statistical analysis", "Insights report"],
      deliverable: "Upload your Jupyter notebook or share a GitHub repository link."
    },
    "Cloud Computing": {
      title: "Cloud Deployment Project",
      description: "Deploy a web application to a cloud platform (AWS/GCP/Azure). Implement auto-scaling, storage, and monitoring.",
      requirements: ["Cloud platform deployment", "Auto-scaling configuration", "Storage setup", "Monitoring and logging", "Security configuration"],
      deliverable: "Share your deployment URL and configuration documentation."
    },
    "Cyber Security": {
      title: "Security Audit & Penetration Testing Report",
      description: "Perform a security audit on a test environment. Identify vulnerabilities, document findings, and propose remediation strategies.",
      requirements: ["Vulnerability scanning", "Penetration testing on test systems", "Risk assessment report", "Remediation recommendations", "Security best practices"],
      deliverable: "Upload your security audit report as PDF."
    },
    "Communication": {
      title: "Professional Presentation & Report",
      description: "Create and deliver a professional presentation on a topic of your choice. Include written report, slides, and recorded video presentation.",
      requirements: ["10-slide professional presentation", "Written summary report", "Clear verbal communication", "Proper structure and flow", "Visual storytelling"],
      deliverable: "Upload your presentation slides and video recording."
    },
    "Soft Skills": {
      title: "Leadership & Teamwork Case Study",
      description: "Write a detailed case study on a leadership scenario. Demonstrate emotional intelligence, conflict resolution, and team management skills.",
      requirements: ["Real or simulated leadership scenario", "Emotional intelligence analysis", "Conflict resolution strategy", "Team management approach", "Lessons learned"],
      deliverable: "Upload your case study as a PDF document."
    },
    "Interview Preparation": {
      title: "Mock Interview Portfolio",
      description: "Complete a mock interview portfolio including a polished resume, cover letter, LinkedIn profile, and recorded mock interview video.",
      requirements: ["Professional resume", "Tailored cover letter", "LinkedIn profile optimization", "Recorded mock interview", "Interview reflection report"],
      deliverable: "Upload all documents and video recording."
    },
  };

  const matchedKey = Object.keys(assignmentBank).find(key =>
    courseTitle?.toLowerCase().includes(key.toLowerCase()) ||
    key.toLowerCase().includes(courseTitle?.toLowerCase())
  );

  return matchedKey ? assignmentBank[matchedKey] : {
    title: `${courseTitle} Capstone Project`,
    description: `Build a comprehensive project demonstrating your mastery of ${courseTitle} concepts covered in this course.`,
    requirements: ["Apply core concepts", "Write clean code", "Follow best practices", "Document your work", "Present your solution"],
    deliverable: "Upload your project files or share a repository link."
  };
};

export const getCourseVideo = (courseTitle, topicTitle = "") => {
  const videoMap = {
    "HTML":               "HTML full course for beginners",
    "CSS":                "CSS full course for beginners",
    "JavaScript":         "JavaScript full course for beginners",
    "React":              "React JS full course for beginners",
    "Node.js":            "Node.js full course for beginners",
    "Python":             "Python full course for beginners",
    "MongoDB":            "MongoDB full course for beginners",
    "SQL":                "SQL full course for beginners",
    "AI":                 "Artificial Intelligence full course",
    "Data Science":       "Data Science full course for beginners",
    "Cloud Computing":    "AWS Cloud Computing full course",
    "Cyber Security":     "Cyber Security full course for beginners",
    "Communication":      "Communication skills full course",
    "Soft Skills":        "Soft skills training full course",
    "Interview Preparation": "Job interview preparation complete guide",
  };

  const matchedKey = Object.keys(videoMap).find(key =>
    courseTitle?.toLowerCase().includes(key.toLowerCase()) ||
    key.toLowerCase().includes(courseTitle?.toLowerCase())
  );

  const baseQuery = matchedKey ? videoMap[matchedKey] : `${courseTitle} tutorial`;
  const searchQuery = topicTitle
    ? `${courseTitle} ${topicTitle} tutorial`
    : baseQuery;

  return `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(searchQuery)}`;
};

export const getFallbackContent = (courseName, courseId) => {
  const name = (courseName || "").toUpperCase();
  let selected = TOPICS.HTML; // default fallback

  if (name.includes("HTML")) selected = TOPICS.HTML;
  else if (name.includes("CSS")) selected = TOPICS.CSS;
  else if (name.includes("REACT")) selected = TOPICS.REACT;
  else if (name.includes("NODE")) selected = TOPICS.NODE;
  else if (name.includes("MONGODB") || name.includes("MONGO")) selected = TOPICS.MONGODB;
  else if (name.includes("SQL") || name.includes("DATABASE")) selected = TOPICS.SQL;
  else if (name.includes("PYTHON")) selected = TOPICS.PYTHON;
  else if (name.includes("AI") || name.includes("INTELLIGENCE") || name.includes("MACHINE LEARNING") || name.includes("ML")) selected = TOPICS.AI;
  else if (name.includes("DATA SCIENCE") || name.includes("PANDAS") || name.includes("STATISTICS")) selected = TOPICS.DATA_SCIENCE;
  else if (name.includes("CLOUD") || name.includes("AWS") || name.includes("GCP")) selected = TOPICS.CLOUD;
  else if (name.includes("CYBER") || name.includes("SECURITY")) selected = TOPICS.CYBER_SECURITY;
  else if (name.includes("COMMUNICATION")) selected = TOPICS.COMMUNICATION;
  else if (name.includes("APTITUDE")) selected = TOPICS.APTITUDE;
  else if (name.includes("SOFT SKILLS") || name.includes("TEAMWORK") || name.includes("LEADERSHIP")) selected = TOPICS.SOFT_SKILLS;
  else if (name.includes("INTERVIEW") || name.includes("RESUME") || name.includes("CAREER")) selected = TOPICS.INTERVIEW_PREP;
  else if (name.includes("JAVASCRIPT") || name.includes("JS")) selected = TOPICS.JAVASCRIPT;

  // Compile modules
  const modules = [
    {
      _id: `${courseId}-mod-1`,
      name: "Module 1: Foundations & Core Essentials",
      courseId: courseId,
      quizzes: [
        {
          _id: `${courseId}-quiz-1`,
          moduleId: `${courseId}-mod-1`,
          title: `Quiz: ${selected.videoTitle}`,
          questions: generateQuiz(courseName)
        }
      ]
    },
    {
      _id: `${courseId}-mod-2`,
      name: "Module 2: Advanced Implementations & Projects",
      courseId: courseId,
      quizzes: []
    }
  ];

  // Compile submodules
  const subModules = selected.topics.map((t, idx) => ({
    _id: `${courseId}-sub-${idx + 1}`,
    moduleId: idx < 2 ? `${courseId}-mod-1` : `${courseId}-mod-2`,
    name: t.name,
    content: t.content
  }));

  // Compile videos
  const videos = [
    {
      _id: `${courseId}-vid-1`,
      subModuleId: `${courseId}-sub-2`,
      title: `Video Lecture: ${selected.videoTitle}`,
      videoUrl: getCourseVideo(courseName, selected.videoTitle),
      duration: "12:45",
      description: `Watch this comprehensive guide on the fundamentals of ${courseName} to solidifying your basic configurations.`
    }
  ];

  // Compile assignments
  const assignments = selected.assignments.map((asm, idx) => ({
    _id: `${courseId}-asm-${idx + 1}`,
    moduleId: idx < 2 ? `${courseId}-mod-1` : `${courseId}-mod-2`,
    title: asm.title,
    description: asm.description,
    maxMarks: 100
  }));

  // Compile final assignments
  const finalAssignmentData = generateFinalAssignment(courseName);
  const finalAssignments = [
    {
      _id: `${courseId}-final-1`,
      courseId: courseId,
      title: finalAssignmentData.title,
      description: finalAssignmentData.description,
      requirements: finalAssignmentData.requirements,
      deliverable: finalAssignmentData.deliverable,
      maxMarks: 100
    }
  ];

  return {
    modules,
    subModules,
    videos,
    assignments,
    quizzes: modules[0].quizzes,
    finalAssignments
  };
};
