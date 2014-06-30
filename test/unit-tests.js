Object.keys(require.entries).forEach(function(entry){
    if ( (/unit/).test(entry) ) {
        console.log( 'running:', entry );
        require(entry, null, null, true);
    }
});