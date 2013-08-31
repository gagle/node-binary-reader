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
- It is lazy! Delays the open and read calls until they are necessary, ie. `br.open(file).close()` does nothing.

---

<a name="diagrams"></a>
__How it works?__

To make the things easy there are 5 cases depending on the buffer position and the range of the bytes that you want to read. These cases only apply if the buffer size is smaller than the file size, otherwise the file is stored into memory, so only one i/o call is done.

Suppose a buffer size of 5 bytes (green background).  
The pointer `p` is the cursor and it points to the first byte.  
The pointer `e` is the end and it points to the last byte.  
The `x` bytes are not into memory. They need to be read from disk.  
The `y` bytes are already into memory. No need to read them again.

For simplicity, the `x` group of bytes will be less than a buffer size so they can be read with a single i/o call. The binary reader takes cares of this and makes all the necessary calls to read all the `x` bytes.

<p align="center">
  <img src="https://github.com/gagle/node-binary-reader/blob/master/diagram.png?raw=true"/>
</p>

---

<a name="open"></a>
___module_.open(path[, options]) : Reader) : EventEmitter__

Returns a new `Reader`.

Options:

- __highWaterMark__ - _Number_  
	The buffer size. Default is 16KB.

---

<a name="Reader"></a>
__Reader__
