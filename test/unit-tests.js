Object.keys(require.entries).forEach(function(entry){
    if ( (/unit/).test(entry) ) {
        require(entry, null, null, true);
    }
});