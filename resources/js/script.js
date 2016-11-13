$( document ).ready( function () {

	/**
	 * TODO list with order:
	 * - Add arrows for mobile version and configuration for that (checkbox?).
	 * - Configuration for smaller and bigger versions.
	 * - Add correct CSS (only for mobile version):
	 * 		- add div-container for header
	 * 		- add classes .small, .medium and .big for table (different size of 'td' elements).
	 * 		- remove buttons and add divs
	 * - add link to github and portfolio page in the footer
	 * - Spend more time on game and fix bugs.
	 */
	
	/*************************
	 * CONFIGURATION
	 ************************/
	
	tableSize = 4; 			//default value
	table = [];				//table with coordinates and values
	isDebugMode = false;
	isRestoreMode = false;

	/*************************
	 * GLOBAL VARIABLES;
	 ************************/
	
	isChanged = false;
	currentScore = 0;
	bestScore = 0;
	
	/*************************
	 * INIT
	 ************************/

	init();
	
	/**
	 * Init application.
	 */
	function init() {
		clearCurrentScore();
		clearTable();
		clearHTMLTiles();
		createHTMLTiles();
		if( isRestoreMode ) {
			restoreData();
		} else {			
			generateTile();
			generateTile();
		}
		refreshHTML();
	}
	
	/**
	 * Clear values from table array.
	 */
	function clearTable() {
		for( var row = 1; row <= tableSize; row++ ) {
			table[ row ] = [];
			for( var column = 1; column <= tableSize; column++ ) {
				table[ row ][ column ] = null;
			}
		}
	}
	
	/**
	 * Remove rows and columns from HTML table.
	 */
	function clearHTMLTiles() {
		$( 'table' ).empty();
	}
	
	/**
	 * Create rows and columns in HTML table with using configuration.
	 */
	function createHTMLTiles() {
		tilesHTML = '';
		for( var row = 1; row <= tableSize; row++ ) {
			tilesHTML += '<tr>';
			for(var column = 1; column <= tableSize; column++ ) {
				tilesHTML += '<td id="tile' + row + column + '"></td>';
			}
			
			tilesHTML += '</tr>';
		}
		
		$( 'table' ).append( tilesHTML );
	}
	
	/**
	 * Generate random tile with number (2 or 4) in table.
	 */
	function generateTile() {
		var emptyTiles = getEmptyTiles();
		var randomTile = getRandomTile( emptyTiles );
		var randomNumber = generateNumber();
		var coorArr = emptyTiles[randomTile].split( '' );
		table[ coorArr[ 0 ] ][ coorArr[ 1 ] ] = randomNumber;
	}
	
	/**
	 * Find all empty tiles (without number).
	 * @returns array with empty tiles
	 */
	function getEmptyTiles() {
		var availableTiles = [];
		for( var row = 1; row <= tableSize; row++ ) {
			for( var column = 1; column <= tableSize; column++ ) {
				if( isEmptyTile( row, column) ) {
					availableTiles.push( '' + row + column );
				}
			}
		}
		
		return availableTiles;
	}
	
	/**
	 * Check if tile with coordinates is empty.
	 * Cases for 4x4 table: 
	 * - row is not undefined (0 and 5 rows are) - cases during merge tiles
	 * - tile is null
	 * - tile is not undefined (0 and 5 column are) - cases during merge tiles
	 * @param row the column
	 * @param column the row
	 * @returns boolean value
	 */
	function isEmptyTile( row, column ) {
		return table[ row ] !== undefined 
			&& table[ row ][ column ] === null 
			&& table[ row ][ column ] !== undefined;
	}

	/**
	 * Get random index from array.
	 * @param emptyTiles the array with empty tiles
	 * @returns integer
	 */
	function getRandomTile( emptyTiles ) {
		return Math.floor( Math.random() * emptyTiles.length );
	}
	
	/**
	 * Get random number for set into tile.
	 * @returns integer 2 or 4
	 */
	function generateNumber() {
		var randomNumber = Math.floor( ( Math.random() * 10 ) + 1 );
		return randomNumber > 8 ? 4 : 2;
	}
	
	/**
	 * Get values from table object in javascript and put them into HTML table element.
	 */
	function refreshHTML() {
		for( var row = 1; row <= tableSize; row++ ) {
			for( var column = 1; column <= tableSize; column++ ) {
				if( isEmptyTile( row, column ) ) {
					$( '#tile' + row + column ).empty();
				} else {
					$( '#tile' + row + column ).empty().text( table[ row ][ column ] );
				}
				addTileColour( row, column );
			}
		}
	}

	/*************************
	 * HANDLE CONFIGURATION, EVENTS, SCORE
	 ************************/
	
	/**
	 * Clear message text and init application once again.
	 */
	$( '#reset' ).on( 'click', function( e ) {
		$( '#message' ).empty();
		init();
	} )

	/**
	 * Reset value for current score.
	 */
	function clearCurrentScore() {
		currentScore = 0;
		$( '#currentScore' ).html( '0' );
	}
	
	/**
	 * Set current score.
	 * @param currentScoreVal the current score value to set
	 */
	function addCurrentScore( currentScoreVal ) {
		currentScore = parseInt( currentScore ) + parseInt ( currentScoreVal );
		$( '#currentScore' ).empty().text( currentScore );
		if ( currentScore > bestScore ) {
			bestScore = currentScore;
			$( '#bestScore' ).empty().text( currentScore );
		}
	}
	
	/*************************
	 * HANDLE KEYS
	 ************************/

	/**
	 * Move tiles and generate another one tile if something changed in table.
	 */
	$( document ).on( 'keydown', function( e ) { 
		if( isDebugMode ) {
			logTiles( e );
		}

		//used 'e.which' because it's better for jQuery -  'e.keyCode' is good for javascript
		isChanged = false;
		switch( e.which ) {
			case 37: //left
				moveLeft();
				break;
			case 38: //up
				moveUp();
				break;
			case 39: //right
				moveRight();
				break;
			case 40: //down
				moveDown();
				break;
			default:
				return;
				break;
		}
		
		if( isChanged ) {
			generateTile();
			if( isEndGame() ) {
				refreshHTML();
				$( '#message' ).html( 'You don\'t have available move.' );
			}
		}
		refreshHTML();
	} )
	
	/**
	 * Check from left of table.
	 * The only different between 'moveLeft/Up/Right/Down' methods is other order of checking tiles in table.
	 */
	function moveLeft() {
		for( var row = 1; row <= tableSize; row++ ) {
			for( var column = 1; column <= tableSize; column++ ) {
				moveTile( row, column, 0, -1 );
			}
		}
	}

	/**
	 * Check from top of table.
	 * The only different between 'moveLeft/Up/Right/Down' methods is other order of checking tiles in table.
	 */
	function moveUp() {
		for( var column = 1; column <= tableSize; column++ ) {
			for( var row = 1; row <= tableSize; row++ ) {
				moveTile( row, column, -1, 0 );
			}
		}
	}

	/**
	 * Check from right of table.
	 * The only different between 'moveLeft/Up/Right/Down' methods is other order of checking tiles in table.
	 */
	function moveRight() {
		for( var row = tableSize; row >= 1; row-- ) {
			for( var column = tableSize; column >= 1; column-- ) {
				moveTile( row, column, 0, 1 );
			}
		}
	}
	
	/**
	 * Check from down of table.
	 * The only different between 'moveLeft/Up/Right/Down' methods is other order of checking tiles in table.
	 */
	function moveDown() {
		for( var column = tableSize; column >= 1; column-- ) {
			for( var row = tableSize; row >= 1; row-- ) {
				moveTile( row, column, 1, 0 );
			}
		}
	}

	/**
	 * Move tile in table. Do nothing if tile is empty.
	 * @param i the current row
	 * @param j the current column
	 * @param moveRow the direction of row to move
	 * @param moveColumn the direction of column to move
	 */
	function moveTile( currentRow, currentColumn, moveRow, moveColumn ) {
		if( isEmptyTile( currentRow, currentColumn ) ) {
			return false;
		}
		
		var nextRow = currentRow + moveRow;
		var nextColumn = currentColumn + moveColumn;
		var previousRow, previousColumn;
		while( isEmptyTile( nextRow, nextColumn ) ) {
			currentRow = nextRow - moveRow;
			currentColumn = nextColumn - moveColumn;

			//Move value from previous tile
			table[ nextRow ][ nextColumn ] = table[ currentRow ][ currentColumn ];
			//Clear current tile
			table[ currentRow ][ currentColumn ] = null;

			nextRow = nextRow + moveRow;
			nextColumn = nextColumn + moveColumn;
			isChanged = true;
		}

		mergeTiles( nextRow - moveRow, nextColumn - moveColumn, nextRow, nextColumn );
	}
	
	/**
	 * Check if current and next tiles contain the same value and merge them.
	 * @param currentRow the current row
	 * @param currentColumn the current column
	 * @param nextRow the next row
	 * @param nextColumn the next column
	 */
	function mergeTiles( currentRow, currentColumn, nextRow, nextColumn ) {
		var nextValue = table[nextRow] === undefined ? null : table[ nextRow ][ nextColumn ];
		var currentValue = table[ currentRow ][ currentColumn ];
		if( nextValue == currentValue ) {
			var valueAfterMerge = table[ nextRow ][ nextColumn ] * 2
			table[ nextRow ][ nextColumn ] = valueAfterMerge;
			table[ currentRow ][ currentColumn ] = null;

			addCurrentScore( valueAfterMerge );
			isChanged = true;
		}
	}
	
	/**
	 * Change colour of tile.
	 * Remove CSS class and add another one connected with value.
	 * @param row the row of tile to check
	 * @param column the column of tile to check
	 */
	function addTileColour( row, column ) {
		$( '#tile' + row + column ).removeClass();
		var tileValue = table[ row ][ column ];
		if( !isEmptyTile( row, column ) ) {
			$( '#tile' + row + column ).addClass( 'colour' + tileValue );
		}
	}

	/**
	 * Check if table has got empty tiles and it's possible to merge tiles.
	 * If table contains empty tiles or is possible to merge tiles - return false.
	 * @returns boolean value
	 */
	function isEndGame() {
		if( getEmptyTiles().length != 0 ) {
			return false;
		} 

		for( var row = 1; row <= tableSize; row++ ) {
			for( var column = 1; column <= tableSize; column++ ) {
				if( isPossibleMerge( row, column ) ) {
					return false;
				}
			}
		}
		return true;
	}
	
	/**
	 * Check if is possible to merge tiles in table.
	 * @param row the row of tile to check
	 * @param column the column of tile to check
	 * @returns boolean value
	 */
	function isPossibleMerge( row, column ) {
		var centerVal = table[ row ][ column ];
		return $.inArray( centerVal, getNextValues( row, column ) ) != -1;
	}
	
	/**
	 * Get value from tiles around checking value.
	 * @param row the row of tile to check
	 * @param column the column of tile to check
	 * @returns array with values
	 */
	function getNextValues( row, column ) {
		var leftVal = table[ row ][ column -1 ];
		var rightVal = table[ row ][ column + 1 ];
		 //the same problem like in isEmptyTile
		var upVal = table[ row - 1 ] === undefined ? undefined: table[ row - 1 ][ column ];
		var downVal = table[ row + 1 ] === undefined ? undefined : table[ row + 1 ][ column ];
		return [ leftVal, rightVal, upVal, downVal ];
	}
	
	/*************************
	 * TEST TILES AND DEBUGGING
	 ************************/
	
	function restoreData() {
		var dataToRestore = '2;8;16;32;64;128;256;512;1024;2048;null;null;null;null;null;null';
		var dataArray = dataToRestore.split( ';' );
		var i = 0;
		for( var row = 1; row <= tableSize; row++ ) {
			for( var column = 1; column <= tableSize; column++ ) {
				if( dataArray[ i ] === 'null' ) {
					table[ row ][ column ] = null;
				} else {
					table[ row ][ column ] = dataArray[ i ];
				}
				i++;
			}
		}
		refreshHTML();
	}

	/**
	 * Log value of tiles in table (copy from console and paste into restoreData() 
	 * the whole log for restore the specific setting of table).
	 * @param e the event from keyboard
	 */
	function logTiles( e ) {
		var arrow = '';
		switch( e.which ) {
			case 37:
				arrow = 'left';
				break;
			case 38:
				arrow = 'up';
				break;
			case 39:
				arrow = 'right';
				break;
			case 40:
				arrow = 'down';
				break;
			default:
				return;
				break;
		}
		
		var values = '';
		for( var row = 1; row <= tableSize; row++ ) {
			for( var column = 1; column <= tableSize; column++ ) {
				var value = table[ row ][ column ];
				values += value + ';';
			}
		}
		
		//Values will be separate with ';'.
		//Example: 2;8;32;;
		//Value 2, value 8, value 32, empty value
		console.log( 'logTiles( arrow: ' + arrow + ' ): ' );
		console.log( 'var dataToRestore = "' + values + '";' );
	}
	
} )
