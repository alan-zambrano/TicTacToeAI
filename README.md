# Tic-Tac-Toe AI
This is a short program I wrote to learn javascript. The program plays
tic-tac-toe with the user while looking through all possible moves until
endgame to select moves with the best outcome.

## Tree
@Tree and @Node are classes used to contain the board's state for the current
move. The program starts by creating a tree with an empty board as root. Every
generation thereafter adds another move to the board. This tree is built
recursively such that all children are different endgame states. Indeed,
children must not necessarily be full boards, but tokens must be in a position
where either X or O wins.

## Node
Used to contain root and its children, which in turn contain their own children
and so forth. It is a tool used to traverse the tree.

## Board
Contains a 2D array used to represent the game board. The following board array
\[\[O...\]\[...\]\[...\]\] would contain an 'O' in the top left corner of the
board

## Algorithm
This program uses the minimax algorithm which builds on the concept that each player is trying to maximize their score. Thus it's our AI's job to maximize its own score while minimizing the opponent's score. In a win/lose game like tic-tac-toe, we can quantify a player's score by the amount of turns it takes to win.
We can visualize the game's timeline with a tree in which each node represents a turn in the game. Thus each leaf represents a different endgame layout. In the recursive approach, the leaves are one of three base cases: 1) the AI wins 2) the opponent wins 3) neither wins and we draw. They then have a score of 10, -10 and 0 respectively. Parent nodes, however must be indicative of their proximity to winning or losing states, and thus decrease the value by 1. The values of direct parents of losing nodes are then -9 and that of winning nodes are 9. Drawn states continue to be 0. 
Further, parents with multiple children face a dilemma in which they must select their own value from the perhaps wildly varying values of their children. We then must consider the behavior of the player whose turn it is for that particular node. We must assume that the opponent will try to minimize our score and will select the most negative child and that our AI should aim for the most positive child. Thus for non-leaf nodes, we alternate values between most negative value + 1 and most positive value - 1 depending on whose turn it is for that particular node.
The algorithm is eloquently described in more detail here: https://www.neverstopbuilding.com/blog/minimax

## Next