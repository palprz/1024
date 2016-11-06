$( document ).ready( function () {

	/**
	 * TODO list with order:
	 * - Add possible to merge more than two tiles in the row (e.g. 4,4,2,2 -> 8,4. For now it's: 8,2,2).
	 * - Add end of game - check empty tiles and possible of merge tiles.
	 * - Spend more time on game and fix bugs.
	 * - Add score.
	 * - Configuration for smaller and bigger versions.
	 * - Change CSS.
	 */
	
	/*************************
	 * CONFIGURATION
	 ************************/
	
	tableSize = 4; //default value
	
	/*************************
	 * INIT
	 ************************/

	init();
	
	/**
	 * Init application.
	 */
	function init() {
		clearTiles();
		createTiles();
		
		generateTile();
		generateTile();
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
			for ( var j = 1; j <= tableSize; j++ ) {
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
	 * HANDLE KEYS
	 ************************/

	/**
	 * Move tiles and generate another one tile.
	 */
	$( document ).on( 'keydown', function( e ) { 
		//used 'e.which' because it's better for jQuery -  'e.keyCode' is good for javascript
		switch( e.which ) {
			case 37: //left
				moveLeft();
				generateTile();
				break;
			case 38: //up
				moveUp();
				generateTile();
				break;
			case 39: //right
				moveRight();
				generateTile();
				break;
			case 40: //down
				moveDown();
				generateTile();
				break;
			default:
				break;
		}
	} )
	
	/**
	 * Check from left of table.
	 * The only different between 'moveLeft/Up/Right/Down' methods is other order of checking tiles in table.
	 */
	function moveLeft() {
		for ( var row = 1; row <= tableSize; row++ ) {
			for ( var column = 1; column <= tableSize; column++ ) {
				moveTile( row, column, 0, -1 );
			}
		}
	}

	/**
	 * Check from top of table.
	 * The only different between 'moveLeft/Up/Right/Down' methods is other order of checking tiles in table.
	 */
	function moveUp() {
		for ( var column = 1; column <= tableSize; column++ ) {
			for ( var row = 1; row <= tableSize; row++ ) {
				moveTile( row, column, -1, 0 );
			}
		}			
	}

	/**
	 * Check from right of table.
	 * The only different between 'moveLeft/Up/Right/Down' methods is other order of checking tiles in table.
	 */
	function moveRight() {
		for ( var row = tableSize; row >= 1; row-- ) {
			for ( var column = tableSize; column >= 1; column-- ) {
				moveTile( row, column, 0, 1 );
			}
		}
	}
	
	/**
	 * Check from down of table.
	 * The only different between 'moveLeft/Up/Right/Down' methods is other order of checking tiles in table.
	 */
	function moveDown() {
		for ( var column = tableSize; column >= 1; column-- ) {
			for ( var row = tableSize; row >= 1; row-- ) {
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
		if ( isEmptyTile( i, j ) ) {
			return;
		}
		var nextRow = i + moveRow;
		var nextColumn = j + moveColumn;
		var previousRow;
		var previousColumn;
		while( isEmptyTile( nextRow, nextColumn ) ) {
			currentRow = nextRow - moveRow;
			currentColumn = nextColumn - moveColumn;
			
			//Move value from previous tile
			$( '#tile' + nextRow + nextColumn ).append( $( '#tile' + currentRow + currentColumn ).html() );
			//Clear current tile
			$( '#tile' + currentRow + currentColumn ).empty( '' );
			
			//Change colours
			addTileColour( nextRow, nextColumn );
			addTileColour( currentRow, currentColumn );

			nextRow = nextRow + moveRow;
			nextColumn = nextColumn + moveColumn;
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
			$( '#tile' + nextRow + nextColumn ).html( parseInt( nextValue ) * 2 );
			$( '#tile' + currentRow + currentColumn ).empty();

			addTileColour( nextRow, nextColumn );
			addTileColour( currentRow, currentColumn );
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
		if ( !isEmptyTile( i, j ) ) {
			$( '#tile' + i + j ).addClass( 'colour' + tileValue );
		}
	}
	
} )