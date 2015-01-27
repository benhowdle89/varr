# Varr

## Description

Varr is an extremely basic variable replacement command line Node.js module. It's intended for use with CSS files, turning this source CSS code:

```
$brand_colour: #777;
$brand_font: Helvetica;
---

body {
	background: $brand_colour;
	font-family: $brand_font;
	border: 1px solid $brand_colour;
}

```

into this:

```
body {
	background: #777;
	font-family: Helvetica;
	border: 1px solid #777;
}
```

_Caveats_

- Varr is ridiculously basic in it's implementation & functionality. Coming in at ~100 lines of JavaScript, this is **not** meant to be any sort of Sass alternative, let alone a competitor.
- This tiny module was born out of redesigning my personal site and just wanting a quick way to add variables to my single CSS file.
- Tl;dr - If you never re-invent a wheel, you'll never get the fun and learning that comes from inventing a wheel.

## Installation

`npm install varr -g`

# Setup

Varr expects certain config at the top of your source CSS file. The expected format looks like so:

```
$foo: bar;
$someFont: Arial;
---

body {
	background: $foo;
	font-family: $someFont;
}
```

If you've ever used Sass, then this should look fairly familiar. A set of key/values separated by line breaks.

The only other thing that is **very key**, is the 3 dashes below the variables. This tells Varr when to stop looking for config variables. Don't forget these. And always put the variables at the top of the file.

# Usage

Usage is dead simple. First `cd` to a folder with a CSS file in it. Now we can run Varr.

The most basic command is:

`varr -i style.css`

This will take `style.css` as an input, process & replace the variables, and then output the new, compiled CSS file to `dist/style.css`. Varr outputs the new CSS file relative to where you're running the command (inside a folder called "dist"). If you'd like to change the output path, read on...

`varr -i style.css -o production/live.css`

Will take the same "style.css" input file, but once it's processed it, will output it to a folder called "production" (no need to create this folder) and call the new file "live.css".

Lastly, Varr does support file watching, so this command:

`varr -i style.css -o production/live.css watch`

Will run the module each time you hit save on "style.css". 

As per usual, errors are output to the command line, but should you hit save prematurely and it errors, just fix up your file and re-save it. The program *should not* break.