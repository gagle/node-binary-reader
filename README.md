binary-reader
============

_Node.js project_

#### Buffered binary reader with a fluent api ####

Version: 0.0.1

The BinaryReader is a wrapper around the `fs.read()` function. It has an internal buffer that maintains the last chunk of data read from disk, so it minimizes the number of i/o calls. If the requested data is already in the buffer it doesn't perform any i/o call and the data is copied from the buffer. It also implements a fluent interface for your ease.

#### Installation ####

```
npm install binary-reader
```

#### Documentation ####

- [What are its uses?](#uses)
- [How it works?](#diagrams)

#### Functions ####

- [_module_.open(path[, options]) : Reader](#open)

#### Objects ####

- [Reader](#Reader)

---

<a name="uses"></a>
__What are its uses?__

Anything that reads binary files. These are the benefits you'll win:

- Read big binary files without caring about how to retrieve the data and without implementing your own internal cursor system.
- Avoids the callback nesting. It uses a very lightweight asynchronous control flow library: [deferred-queue](https://github.com/gagle/node-deferred-queue).
- Eases the error handling.

---

<a name="diagrams"></a>
__How it works?__

---

<a name="open"></a>
___module_.open(path[, options]) : Reader) : EventEmitter__



---

<a name="Reader"></a>
__Reader__
