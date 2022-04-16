const images = document.querySelectorAll( '[data-src]' );
const preload_image = target =>
{
    const src = target.getAttribute( 'data-src' );
    if ( !src ) return;
    target.src = src;
    target.removeAttribute( 'lazy' );
};

const options = {
    root: null,
    rootMargin: '-50px',
    threshold: 0.25
};

const image_observer = new IntersectionObserver( ( entries, image_observer ) =>
{
    entries.forEach( entry =>
    {
        if ( entry.isIntersecting )
        {
            preload_image( entry.target );

            image_observer.unobserve( entry.target );
        }
    } );
}, options );

images.forEach( image =>
{
    image_observer.observe( image );
} );