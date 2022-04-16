module.exports = {
    secondsToHms: d =>
    {
        d = Number( d );
        const h = Math.floor( d / 3600 );
        const m = Math.floor( d % 3600 / 60 );
        const s = Math.floor( d % 3600 % 60 );

        const hDisplay = h > 0 ? h + ( h == 1 ? "H " : "Hs " ) : "";
        const mDisplay = m > 0 ? m + ( m == 1 ? "M " : "Ms " ) : "";
        const sDisplay = s > 0 ? s + ( s == 1 ? "S " : "Ss " ) : "";
        if ( hDisplay == 0 )
        {
            if ( mDisplay == 0 ) return sDisplay;
            return mDisplay;
        }
        return hDisplay;
    },

};