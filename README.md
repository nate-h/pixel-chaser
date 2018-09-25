# Algorithmic Drawing
Draws pictures using algorithms

# On running the program.
  * install gulp


## Based on
The idea for this came from this https://www.michaelbromley.co.uk/experiments/chromata/
Without looking at the code, I wanted to create something similar.


## Plan for creating
* Take an image and scale down/scale up the original image so that the dimensions are 200*150.
* Break down image into rgb colors matrix
* Grab N random points in that rgb matrix
* Apply depth-first search using to each node of matrix
* Each node has it's 8 adjacent nodes with the exception of the pictures edges
* Have speed at which I traverse nodes
* Traverse nodes based on which nodes is light/darkest or whatever metric I choose
* Keep traversing nodes until all nodes are visited
* A click restart it


# IDEAS?
Add noise to influence direction.
Use multiple filters at once.
Every so often branch off and start new independent path?

# TODO
operate on block of pixels rather than a single pixel.
 * if block size matches pixelation size, algorithm looks less hacky.
Add edge detection and paint those pixels black.
 * black edges will attract dfs path drawer and would look cool.
Add guassian filter
 * Need to smooth out data to edge detection isn't that crazy.
Need to output image arrays so we can see what the data looks like.
    * Every adjustment to the image should output an image

posterization
