/*
	FLEX BOX NOTES          T_T

	flex-basis (limited by min|max-width|height),
	if auto (default) --> width|height (if none set) --> content
	
	
	if parent is Column:
		basis controls height
		limited by minHeight, maxHeight
		default: auto (uses 'height' or content height)
	if parent is Row:
		basis controls width
		limited by minWidth, maxWidth
		default: auto (uses 'width' or content width)
	
	
	minWidth: auto | number  (auto uses min-content, or if overflow = scroll: 0)
	maxWidth: none | number
	
	wFill, hFill
	fillView
	
	
	FLEX SELF
		Default: Length fits to content
			-> parent is COLUMN: height fits to content
			-> parent is ROW: width fits to content
		Options:
			grow || grow=#
				-> length grows into available space
				-> default: 0 (no grow)
				-> parent is COLUMN: grows vertically
				-> parent is ROW: grows horizontally
			shrink || shrink=#
				-> length shrinks to minHeight|minWidth if needed
				-> default: 0 (no shrink)
				-> parent is COLUMN: minHeight
				-> parent is ROW: minWidth
			basis=#
				-> sets starting length before inserted into parent
				-> default: auto
				-> parent is COLUMN: height
				-> parent is ROW: width
			selfStart
				-> overrides self alignment in parent to flex-start
				-> parent is COLUMN: top
				-> parent is ROW: left
			selfEnd
				-> overrides self alignment in parent to flex-end
				-> parent is COLUMN: bottom
				-> parent is ROW: right
			selfStretch
				-> overrides self alignment in parent to stretch
				-> parent is COLUMN: horizontal
				-> parent is ROW: vertical
	
	
	<Col />
		SELF: See FLEX SELF
		CHILDREN: arranged in column
	        Justification (main axis: vertical)
		        childN (default)
		            -> children flush with top
		        childCenterV || childC
		            -> centers children vertically
		        childS
		            -> children flush with bottom
		        childSpread
		            -> distributes available space between children (space-between)
		        childSpaced
		            -> distributes available space between and around children (space-evenly)
	        
	        Alignment (cross axis: horizontal)
	            childStretch (default)
	                -> children stretched horizontally to fill container
	            childW
	                -> children flush with left
		        childCenterH || childC
		            -> centers children horizontally
	            childE
	                -> children flush with right
            Other
                noWrap (default)
                wrap
        
	
	<Row />
		SELF: See FLEX SELF
		CHILDREN: arranged in row
	        Justification (main axis: horizontal)
		        childW (default)
		            -> children flush with left
		        childCenterH || childC
		            -> centers children horizontally
		        childE
		            -> children flush with right
		        childSpread
		            -> distributes available space between children (space-between)
		        childSpaced
		            -> distributes available space between and around children (space-evenly)
	        
	        Alignment (cross axis: vertical)
	            childStretch (default)
	                -> children stretched vertically to fill container
	            childN
	                -> children flush with top
		        childCenterV || childC
		            -> centers children vertically
	            childS
	                -> children flush with bottom
	
	
	
	
	<Scroll /> = Col with overflow: auto
	<Slide /> = Row with overflow: auto
	
	<Btn /> Row
	
 */