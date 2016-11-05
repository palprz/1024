$( document ).ready( function () {
	
	//configuration
	tableSize = 4; //default value
	 
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
		$( 'table' ).html( '' );
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
	
} )