/*
 *TODO: the GAME_TREE object can be compressed by making equal states into the
 * same node in the tree. Consider the first three turns for the two games below
 * as an example.
 * 1a         1b          1c
 * X |  |     X | O |     X | O |
 * ---------  ----------  ----------
 *   |  |   =>  |   |   =>X |   |
 * ---------  ----------  ----------
 *   |  |       |   |       |   |
 
 * 2a         2b          2c
 *   |  |       | O |     X | O |
 * ---------  ----------  ----------
 * X |  |   =>X |   |   =>X |   |
 * ---------  ----------  ----------
 *   |  |       |   |       |   |
 * The states of nodes 1c and 2c are identical and so they will each contain
 * equivalent combinations of states as their children. This is redundant and we
 * can save space by simply merging the two nodes together and have nodes 1b and
 * 2b point to a common node 1-2c to save space. The reason this problem occurs
 * in the first place is because this algorithm considers each turn as a
 * separate node on the tree, which causes each node 1c and 2c to branch off
 * into its own section of the tree.
 *
 * Although, because there are so few playable combinations, this saved space
 * is negligible. This improvement is a consideration for future, larger
 * projects.
 */
/*test comment*/
window.addEventListener("load", main);

document.getElementById("gameBoardElem").addEventListener("click", function(e){
	if(e.target && e.target.className == "token"){
		if(playerTurn(e.target.id) != -1){
			document.getElementById(e.target.id).src = "tictactoe_X.png";
		}
		compTurn();
	}
})


class Board{
	constructor(x00, x01, x02, x10, x11, x12, x20, x21, x22){
		this.board = [[x00, x01, x02],
					[x10, x11, x12],
					[x20, x21, x22]];
	}
	
	//creates a new board with the added token at (@x,@y) and returns that board
	place(x, y, token){
		let newState = new Board();
		for(let i = 0; i < 3; i++){
			newState.board[i] = this.board[i].slice();
		}
		newState.board[x][y] = token;
		return newState;
	}
}

/*
 *@parent: current node's parent. null for root
 *@data: 10 if current node's board wins -10 if it loses, 0 for draw
 *@gameBoard: Board object that holds the game state for that node
 *@token: 'X' or 'O' for the current turn
 *@children: 3x3 array of @Nodes containing the next turn in the
 * respective position. i.e. if the user places their token in position (0,1),
 * this.children[0][1] will contain the @Node for that turn.
 */
class Node{
	//children put into a 2d array to best match tic-tac-toe moveset.
	constructor(parent, data, gameBoard = new Board(), turn){
		this.data = data;
		this.boardObj = gameBoard;
		this.parent = parent;
		this.token = turn;
		this.children = [[null, null, null], [null, null, null], [null, null, null]];
	}
	
	addNode(val, xPos, yPos, gameBoard, turn){
		this.children[xPos][yPos] = new Node(this, val, gameBoard, turn);
	}
}
/*
 *@root: Node object with a blank @Board
 *
 *Sets root's token to 'O' so that the first actual turn (root's child)
 * will be 'X'
 */
class Tree{
	constructor(data){
		let gameState = new Board(null, null, null, null, null, null, null, null, null);
		let node = new Node(null, data, gameState, 'O');
		this.root = node;
	}
}

/*
 *@GAME_TREE: @Tree object containing all possible turns
 *@CURR_TURN: @Node object representing current turn on the tree
 */
let GAME_TREE = new Tree();
let CURR_TURN;
let GAME_OVER = false;

//used to check equality for an indefinite number of objects
function areEqual(){
	var len = arguments.length;
	for (var i = 1; i< len; i++){
		if (arguments[i] === null || arguments[i] !== arguments[i-1])
		return false;
	}
	
	return true;
}

//@currGameState: Board object on which to check if there is a win.
//checks if there are 3 of the same string in a row
//return: 'X' if X wins, 'O' if O wins, null if neither
function checkGameOver(currGameState){
	let TL = currGameState.board[0][0];
	let TM = currGameState.board[1][0];
	let TR = currGameState.board[2][0];
	let ML = currGameState.board[0][1];
	let MM = currGameState.board[1][1];
	let MR = currGameState.board[2][1];
	let BL = currGameState.board[0][2];
	let BM = currGameState.board[1][2];
	let BR = currGameState.board[2][2];
	
	//check rows
	if(areEqual(TL, TM, TR) && TL)
		return TL;
	else if(areEqual(ML, MM, MR) && ML)
		return ML;
	else if(areEqual(BL, BM, BR) && BL)
		return BL;
		
	//check columns
	if(areEqual(TL, ML, BL) && TL)
		return TL;
	else if(areEqual(TM, MM, BM) && TM)
		return TM;
	else if(areEqual(TR, MR, BR) && TR)
		return TR;
		
	//check diagonals
	if(areEqual(TL, MM, BR) && TL)
		return TL;
	else if(areEqual(TR, MM, BL) && TR)
		return TR;
	
	return null;
}

/*
 *@gameBoard: Board object to check
 *returns: true if every space in @gameBoard is non-null
 * else false.
 */
function isFull(gameBoard){
	for(i = 0 ;i < 3; i++){
		for(j = 0; j < 3; j++){
			if(!gameBoard.board[i][j]){
				return false;
			}
		}
	}
	return true;
}

/*
 *@gameTree: main Tree object
 *@currState: current node in the tree
 *
 *Builds a tree of all playable combinations of tokens for every turn. This
 * considers 3 'O' in a row as a winning state i.e. comp must be 'O' and human
 * player must be 'X'
 */
function buildGameTree(gameTree, currNode){
	//Mark current node if this is a winning, losing, or drawn game
	let winner = checkGameOver(currNode.boardObj);
	if(winner == 'X'){
		currNode.data = -10;
		return currNode.data;
	}
	else if(winner == 'O'){
		currNode.data = 10;
		return currNode.data;
	}
	else if(isFull(currNode.boardObj)){
		currNode.data = 0;
		return currNode.data;
	}
	
	//loop through all possible open slots to play a token
	for(let i = 0; i < 3; i++){
		for(let j = 0; j < 3; j++){
			//for all empty spaces
			if(!(currNode.boardObj.board[i][j])){
				//create new node with updated board
				if(currNode.token == 'X'){
					let newBoard = currNode.boardObj.place(i, j, 'O');
					currNode.addNode(null, i, j, newBoard, 'O');
				}
				else if(currNode.token == 'O'){
					let newBoard = currNode.boardObj.place(i, j, 'X');
					currNode.addNode(null, i, j, newBoard, 'X');
				}
				else{
					console.log("current node has no assigned token. This should never happen.");
				}
			}
		}
	}
	
	//recurse through all children
	let currMax = 0;
	for(let i = 0; i < 3; i++){
		for(let j = 0; j < 3; j++){
			if(currNode.children[i][j]){
				let childVal = buildGameTree(gameTree, currNode.children[i][j]);
				if(Math.abs(childVal) > Math.abs(currMax)){
					currMax = childVal;
			}
			}
		}
	}
	//update current node value
	if(currMax < 0){
		currNode.data = currMax + 1;
	}
	else if(currMax > 0){
		currNode.data = currMax - 1;
	}
	else{
		currNode.data = currMax;
	}
	return currNode.data;
}
function playerTurn(clickLocation){
	if(GAME_OVER){
		return -1;
	}
	CURR_TURN = CURR_TURN.children[clickLocation.slice(0,1)][clickLocation.slice(1)];
}
function compTurn(){
	if(CURR_TURN && checkGameOver(CURR_TURN.boardObj)){
		GAME_OVER = true;
	}
	
	if(GAME_OVER){
		return;
	}
	
	let currMax = Number.NEGATIVE_INFINITY;
	let maxI = 0;
	let maxJ = 0;
	
	//select the optimal turn from the current node's children
	for(let i = 0; i < 3; i++){
		for(let j = 0; j < 3; j++){
			if(CURR_TURN.children[i][j] && CURR_TURN.children[i][j].data > currMax){
				currMax = CURR_TURN.children[i][j].data;
				maxI = i;
				maxJ = j;
			}
		}
	}
	
	//traverse node through optimal turn
	CURR_TURN = CURR_TURN.children[maxI][maxJ];
	let docID = maxI.toString() + maxJ.toString();
	document.getElementById(docID).src = "tictactoe_O.png";
	
	if(CURR_TURN && checkGameOver(CURR_TURN.boardObj)){
		GAME_OVER = true;
	}
}
function main(){
	buildGameTree(GAME_TREE, GAME_TREE.root);
	CURR_TURN = GAME_TREE.root
}