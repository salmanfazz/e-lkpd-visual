function ButtonTrackingObj(exp, titleName, cm, frame){
   this.VarTrivBtnTracking = new Variable( 'VarTrivBtnTracking', null, 0, cm, frame, exp, titleName, true );
   this.title = null;
}

ButtonTrackingObj.codeToStateMap =
{
	'N' : 'normalState',
	'O' : 'overState',
	'D' : 'downState',
	'A' : 'disabledState',
	'V' : 'visitedState',
	'S' : 'selectedState'
};
ButtonTrackingObj.stateToCodeMap = {};
for (var key in ButtonTrackingObj.codeToStateMap)
	ButtonTrackingObj.stateToCodeMap[ButtonTrackingObj.codeToStateMap[key]] = key;

ButtonTrackingObj.prototype.InitPageTracking = function ( )
{
	var THIS = this;
	var pageTrackData = this.VarTrivBtnTracking.getValue();
	var bDoInit = true;
	try {
	    if (pageTrackData && pageTrackData.length > 0 && pageTrackData != '~~~null~~~')
	    {
	        var topLevelSplit = pageTrackData.split('#');
	        if (topLevelSplit && topLevelSplit.length > 1)
            {
		        var arrIds = topLevelSplit[0].split(',');
		        var arrStatus = topLevelSplit[1].split(',');
		        for( var i=0; i<arrIds.length; i++ )
		        {
			        var id = parseInt( '0x' + arrIds[i] );
			        var status = arrStatus[i];
			        var node = this.FindNode( this.title, id );
			        if( node )
						node.v = ButtonTrackingObj.codeToStateMap[status] || status;
		        }
    		}
        }
    } catch (e) { }
}

ButtonTrackingObj.prototype.FindNode = function( node, id )
{
	if( node.id == id )
		return node;
	
	var match = null;
	if( typeof( node.c ) != 'undefined' ){
		for( var i=0; i<node.c.length; i++ ){
			match = this.FindNode( node.c[i], id );
			if( match != null )
				break;
		}
	}
	
	return match;
}

ButtonTrackingObj.prototype.InternalGetRangeStatus = function( node )
{
	if( node == null )
		return -1;
		
	if( typeof(node.c) == 'undefined' )
	{
		return node.v;
	}
	else
	{
		return 'normalState';
	}
}


ButtonTrackingObj.prototype.GetRangeStatus = function( id, bInit )
{
	var status = -1;
	if ( bInit ) 
		this.InitPageTracking();
	
	status = this.InternalGetRangeStatus( this.FindNode( this.title, id ) );

	return status;
}


ButtonTrackingObj.prototype.InternalSetRangeStatus=function( node, status )
{
	if( node == null )
		return;
	node.v = status;
	if( status == 0 && typeof(node.c)!='undefined')
	{
		for( var i=0; i<node.c.length; i++ )
			this.InternalSetRangeStatus( node.c[i], status ); 
	}
}

ButtonTrackingObj.prototype.SetRangeStatus = function( id, status /*0 or 1 or 2*/)
{
	this.InternalSetRangeStatus( this.FindNode(this.title, id), status );
	
	this.SavePageTracking();
}

ButtonTrackingObj.prototype.IterateTree = function( func )
{
	var stack = [];
	stack.push( this.title );
	var i = 0;
	while( stack.length > 0 )
	{
		var node = stack.shift();
		
		if( typeof(node.c) != 'undefined' )
			stack = node.c.concat(stack);
			
		//do the thing
		func( node, i, stack );
		i++;
	}	
}

ButtonTrackingObj.prototype.SavePageTracking = function()
{
	var fnIsSaveState = window.ObjButton && ObjButton.isSaveState || function () { return false; };
	var hexString = '';
	var arrayIds = [];
	var arrayStatus= [];
	
	this.IterateTree(function(node, i, stack){
		if (fnIsSaveState(node.v))
		{
			arrayIds.push(node.id);
			arrayStatus.push(node.v);
		}
	});
	
	for( var i=0; i<arrayIds.length; i++ )
		hexString += (i > 0 ? ',' : '') + arrayIds[i].toString(16);

	hexString += (arrayIds.length > 0 ? '#' : '');
	
	for (var i = 0; i < arrayStatus.length; i++)
		hexString += (i > 0 ? ',' : '') + (ButtonTrackingObj.stateToCodeMap[arrayStatus[i]] || arrayStatus[i]);

	//LD-8267 - Added a condition to avoid tracking null/empty data unnecessarily
	if (hexString.length > 0 || (myTop.suspendDataCache && myTop.suspendDataCache.indexOf('VarTrivBtnTracking') >= 0) || !this.VarTrivBtnTracking.bSCORM)
		this.VarTrivBtnTracking.set(hexString);
}

var trivBtnTracking = new ButtonTrackingObj(365,'e_lkpd_visual', 0, null);
trivBtnTracking.title={id:1,v:0,c:[{id:441,v:'normalState'},{id:934,v:'normalState'},{id:1219,v:'normalState'},{id:1724,v:'normalState'},{id:2526,v:'normalState'},{id:2826,v:'normalState'},{id:3358,v:'normalState'},{id:3991,v:'normalState'},{id:4207,v:'normalState'},{id:4663,v:'normalState'},{id:5020,v:'normalState'},{id:5264,v:'normalState'},{id:5414,v:'normalState'},{id:5809,v:'normalState'},{id:5959,v:'normalState'},{id:10182,v:'normalState'},{id:10546,v:'normalState'},{id:6272,v:'normalState'},{id:6539,v:'normalState'},{id:6992,v:'normalState'},{id:7343,v:'normalState'},{id:10878,v:'normalState'},{id:11038,v:'normalState'},{id:7831,v:'normalState'},{id:8098,v:'normalState'},{id:9529,v:'normalState'},{id:9880,v:'normalState'},{id:11352,v:'normalState'},{id:16695,v:'normalState'},{id:11512,v:'normalState'},{id:15457,v:'normalState'},{id:16470,v:'normalState'},{id:15717,v:'normalState'},{id:16245,v:'normalState'},{id:13191,v:'normalState'},{id:13486,v:'normalState'}]};
