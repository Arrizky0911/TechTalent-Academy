const data =  [
    {
        question: 'What is the Document Object Model (DOM)?',
        answer: 'The DOM is a programming interface for web documents. It represents the page structure as a tree of nodes, allowing scripts to update the content, structure, and styles of a document dynamically.',
        feedback: 'Good, concise explanation. You covered the basic definition and its use in updating web content dynamically, which is essential. You could also mention how the DOM is language-agnostic but is commonly manipulated using JavaScript.'
    },
    {
        question: 'What is the difference between HTML and XHTML?',
        answer: 'HTML is more flexible with syntax, while XHTML is stricter and follows XML rules. XHTML documents must be well-formed, with properly nested and closed tags.',
        feedback: 'Solid answer. You correctly highlighted the key difference in syntax flexibility and the requirement for well-formed documents in XHTML. You could add that XHTML was designed to be more compatible with XML tools and technologies.'
    },
    {
        question: 'What is the purpose of the CSS float property?',
        answer: 'The float property in CSS is used to position elements to the left or right, allowing text and inline elements to wrap around them.',
        feedback: 'Great, clear answer. You explained the basic function of the float property. To enhance your answer, you could mention that while float was initially intended for text wrapping, it has historically been used for layout purposes before more modern CSS layout techniques became available.'
    },
    {
        question: 'What are semantic HTML elements?',
        answer: 'Semantic HTML elements clearly describe their meaning in a human- and machine-readable way, like <header>, <footer>, <article>, and <section>. They improve accessibility and SEO.',
        feedback: 'Excellent. You\'ve covered the essence of semantic elements and their benefits in accessibility and SEO. For a more comprehensive answer, you could also mention how semantic elements help search engines better understand the content of the web pages.'
    },
    {
        question: 'What is a CSS preprocessor?',
        answer: 'A CSS preprocessor, like Sass or Less, extends CSS with variables, nesting, and functions, allowing for more maintainable and reusable styles.',
        feedback: 'Good explanation. You touched on the main features of preprocessors. To strengthen your answer, you could discuss how they help in managing large-scale stylesheets by keeping them modular and easier to maintain.'
    },
    {
        question: 'What are the differences between inline, block, and inline-block elements in CSS?',
        answer: 'inline elements dont start on a new line and only take as much width as needed. block elements start on a new line and take the full width. inline-block elements are like inline elements but can have width and height set.',
        feedback: 'Well done. Your answer clearly differentiates between the three display types. You might want to mention that understanding these properties is crucial for controlling the layout and structure of web pages.'
    },
    {
        question: 'What is the difference between null and undefined in JavaScript?',
        answer: 'undefined means a variable has been declared but not assigned a value, while null is an assignment value representing no value or an empty object.',
        feedback: 'Nice work distinguishing the two. Your answer is clear and accurate. A more detailed answer could also include examples of when undefined and null are typically encountered and explain that undefined is a default JavaScript behavior while null is explicitly assigned by developers.'
    },

]

export default data