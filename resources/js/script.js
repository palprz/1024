$( document ).ready( function () {

	/**
	 * TODO list with order:
	 * - Refactor isEndGame for get better performance (create array with values - not: everytime get value from HTML).
	 * - Add arrows for mobile version and configuration for that (checkbox?).
	 * - Configuration for smaller and bigger versions.
	 * - Add correct CSS (only for mobile version).
	 * - Spend more time on game and fix bugs.
	 */
	
	/*************************
	 * CONFIGURATION
	 ************************/
	
	tableSize = 4; //default value
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
		clearTiles();
		createTiles();
		if( isRestoreMode ) {
			restoreData();
		} else {			
			generateTile();
			generateTile();
		}
	}
	
	/**
	 * Remove rows and columns from table.
	 */
	function clearTiles() {
		$( 'table' ).empty();
	}
	
	/**
	 * Create rows and columns in table with using configuration.
	 */
	function createTiles() {
		tilesHTML = '';
		for( var i = 1; i <= tableSize; i++ ) {
			tilesHTML += '<tr>';
			for(var j = 1; j <= tableSize; j++ ) {
				tilesHTML += '<td id="tile' + i + j + '"></td>';
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
		$( '#tile' + emptyTiles[randomTile] ).append( randomNumber );
		var coorArr = emptyTiles[randomTile].split( '' );
		addTileColour( coorArr[0], coorArr[1] );
	}
	
	/**
	 * Find all empty tiles (without number).
	 * @returns array with empty tiles
	 */
	function getEmptyTiles() {
		var availableTiles = new Array();
		for( var i = 1; i <= tableSize; i++ ) {
			for( var j = 1; j <= tableSize; j++ ) {
				if( isEmptyTile( i, j ) ) {
					availableTiles.push( '' + i + j );
				}
			}
		}
		
		return availableTiles;
	}
	
	/**
	 * Check if tile with coordinates is empty.
	 * @param i the column
	 * @param j the row
	 * @returns boolean value
	 */
	function isEmptyTile( i, j ) {
		return $( '#tile' + i + j ).html() == '';
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
		//used 'e.which' because it's better for jQuery -  'e.keyCode' is good for javascript
		if( isDebugMode ) {
			logTiles( e );
		}
		
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
				$( '#message' ).html( 'You don\'t have available move.' );
			}
		}
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
	function moveTile( i, j, moveRow, moveColumn ) {
		if( isEmptyTile( i, j ) ) {
			return false;
		}
		var nextRow = i + moveRow;
		var nextColumn = j + moveColumn;
		var previousRow, previousColumn;
		while( isEmptyTile( nextRow, nextColumn ) ) {
			currentRow = nextRow - moveRow;
			currentColumn = nextColumn - moveColumn;
			
			//Move value from previous tile
			$( '#tile' + nextRow + nextColumn ).html( $( '#tile' + currentRow + currentColumn ).html() );
			//Clear current tile
			$( '#tile' + currentRow + currentColumn ).empty( '' );
			
			//Change colours
			addTileColour( nextRow, nextColumn );
			addTileColour( currentRow, currentColumn );

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
		var nextValue = $( '#tile' + nextRow + nextColumn ).html();
		var currentValue = $( '#tile' + currentRow + currentColumn ).html();
		if( nextValue == currentValue ) {
			var valueAfterMerge = $( '#tile' + nextRow + nextColumn ).html( parseInt( nextValue ) * 2 ).html();
			$( '#tile' + currentRow + currentColumn ).empty();

			addTileColour( nextRow, nextColumn );
			addTileColour( currentRow, currentColumn );
			addCurrentScore( valueAfterMerge );
			isChanged = true;
		}
	}
	
	/**
	 * Change colour of tile.
	 * Remove CSS class and add another one connected with value.
	 * @param i the row
	 * @param j the column
	 */
	function addTileColour( i, j ) {
		$( '#tile' + i + j ).removeClass();
		var tileValue = $( '#tile' + i + j ).html();
		if( !isEmptyTile( i, j ) ) {
			$( '#tile' + i + j ).addClass( 'colour' + tileValue );
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
		var centerVal = $( '#tile' + row + column ).html();
		return $.inArray( centerVal, getNextValues( row, column ) ) != -1;
	}
	
	/**
	 * Get value from tiles around checking value.
	 * @param row the row of tile to check
	 * @param column the column of tile to check
	 * @returns array with values
	 */
	function getNextValues( row, column ) {
		var leftVal = $( '#tile' + row + parseInt( column - 1 ) ).html();
		var upVal = $( '#tile' + parseInt( row - 1 ) + column ).html();
		var rightVal = $( '#tile' + row + parseInt( column + 1 ) ).html();
		var downVal = $( '#tile' + parseInt( row + 1 ) + column ).html();
		return new Array( leftVal, upVal, rightVal, downVal );
	}
	
	/*************************
	 * TEST TILES AND DEBUGGING
	 ************************/
	
	function restoreData() {
		var dataToRestore = '2;8;16;32;64;128;256;512;1024;2048;;;;;;';
		var dataArray = dataToRestore.split( ';' );
		var i = 0;
		for( var row = 1; row <= tableSize; row++ ) {
			for( var column = 1; column <= tableSize; column++ ) {
				$( '#tile' + row + column ).html( dataArray[ i ] );
				addTileColour( row, column );
				i++;
			}
		}
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
				var value = $( '#tile' + row + column).html();
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
