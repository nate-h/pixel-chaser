# Algorithmic Drawing
Draws pictures using alogithms


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
