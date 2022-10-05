I truly appreciate the fact that you have decided to contribute to this project and I'm excited to see
your amazing work being a part of this project.
Before you make your contribution, I'd quickly want you to run through some guidelines so that the odds of merging your PR is high.


## Contributing guidelines

- Although, any type of contribution is welcome, the priority is more towards building the application in terms of code. 
- You may choose to work on frontend, backend or both. Typescript is used at both the ends.
- If you're writing a component, make sure the extension is `.tsx`.
- If you're writing a reusable UI component, put it under `src/UI/your-component` directory.
- Try and incorporate best practices like, keep the code concise, using `const` and `let` instead of `var`. Use `async/await` instead of `.then` syntax for handling asynchronous code etc.
- You may omit writing a stylesheet if you happen to use `styled-components`.

## Getting Started:

- Fork this repository by clicking on 'Fork' present on top right side.
- Clone the repository on your local machine

```terminal
git clone https://github.com/<your-username>/bingenow
```

- Navigate to the project directory.
```terminal
cd bingenow
```

- Install the dependencies
```terminal
npm install
```

- To run the project locally
```terminal
npm start
```


## Making a contribution:

- Create a new Branch (Note: You need not create a new branch for every contribution you make, you can
try reusing the same branch to create new PRs as and when your commits are merged, if you want to follow
this approach, name your branch in a generic way.)

```markdown
git checkout -b my-new-branch
```

- Commit your changes.

```markdown
git commit -m "Relevant message"
```

- Then push

```markdown
git push origin my-new-branch
```

- Create a new pull request from your forked repository


## Any questions

If you've any queries or doubts about contribution, feel free to comment it on issue #1, and I'll respond to it at the earliest.

Happy hacking!