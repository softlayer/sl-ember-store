Object.keys(require.entries).forEach(function(entry){
    if ( (/integration/).test(entry) ) {
        require(entry, null, null, true);
    }
});