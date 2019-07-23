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
Used to contain root and its children, which in turn contain their ownchildren
and so forth. It is a tool used to traverse the tree.

## Board
Contains a 2D array used to represent the game board. A board
\[\[O...\]\[...\]\[...\]\]would contain an 'O' in the top left corner of the
board

## Algorithm
The algorithm I used was inspired by the minmax algorithm in which the AI marks
nodes that are more likely to win with favorable values. The AI starts as soon
as the tree is built. Since all children represent endgame, I mark them with
either a 10 for winning games, -10 for losing games, and 0 for drawn games.
Then after all of a given parent's children have calculated their values, the
parent must select one of its children for the perfect game; however it must
also relay the information back to its own parent so that it may select the
optimal move from its own children. The parent chooses by comparing its
children and selcting its most negative or most positive score with the
following comparison: max(abs(child1), abs(child2), ...). Suppose the parent
selects a positive childx, then the parent's value will be childx-1, or if
childx is negative, the parent will be childx + 1. We want the value to
decrease over generations because we want the path that will guarantee victory
in the shortest number of moves.

## Next
Since testing this algorithm, I've discovered that it's not unbeatable, which
defeats the purpose of an unbeatable AI. In particular, it fails when the
player sets up the board so that they can win in more than one way in a single
turn. Then the AI can only block one of the two ways, and the player ends up
winning on the next turn. The problem is not that the AI can only make one
turn, as it must still follow the rules of the game, but that it should never
be in that position to begin with. The optimal turn should not include one in
which the AI is put into an impossible-to-win game, so the AI should operate
within the constraints of the game to avoid that at all costs.
