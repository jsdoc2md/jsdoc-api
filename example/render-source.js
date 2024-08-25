import jsdoc from 'jsdoc-api'

const source = [
  `import Foo from "foo"
   /**
    * FooPrime is some child class
    * @class
    * @param {Object} - an input
    * @extends Foo
    */
   function FooPrime() {}
   export default FooPrime
`,
`import Foo from "foo"
  /**
   * FooSecond is some other child class
   * @class
   * @param {Object} - an input
   * @extends Foo
   */
  function FooSecond() {}
  export default FooSecond
`]

await jsdoc.render({ source, destination: 'source-output' })
