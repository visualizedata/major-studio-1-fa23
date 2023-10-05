# Baby Data Portrait

[Live Demo](https://munusshih.github.io/dv-majorstudio/lab06_portrait/02_gallery)

This is an example that shows how to use d3.js to create an interactive data portrait.

The idea is to show what d3 can do and how the codes are written to get you something to work with.

Download the latest version (7.6.1) of d3 here to work locally:
[d3-7.6.1.tgz](https://registry.npmjs.org/d3/-/d3-7.6.1.tgz)

Or to link directly to the latest release, copy this snippet:
```HTML
<script src="https://d3js.org/d3.v7.min.js"></script>
```

# Legends
The workflow is to first design a unique graphic for each attribute somewhere else (here we are using [Figma](https://www.figma.com/file/EDBkwC9wW5c3Jy0DSkEp6E/Data-Portrait---Example?node-id=0%3A1)), then put them in the `img/` folder to work in code.

It is worth noting that some of the codes might not be the best solution to approach it. Here we are really trying to do everything in d3 while some functions might be easier to acheive using just vanilla javascript.

![A 2 by 3 legend with six different data types. Behaved, playful, noisy, clean, poopy and cute, each with a corresponding unique squared graphic. Behaved has two black squares in a big square. Playful is a grey half square on the right of the big square. Noisy is two long black traingles in the big square. Clean is also a grey half square but on the left side of the big square. Poopy is with two black circles in a big square. Cute is two grey arcs in a big square.](img/legend.png)

