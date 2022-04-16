$( document ).on( 'click', '.btn-trash', event =>
{
    let current_element = $( event.target );
    if ( current_element.prop( 'tagName' ) != 'BUTTON' )
        current_element = current_element.parent();
    const history_row = current_element.parentsUntil( 'tbody' );
    console.log( history_row );
    $.post( '/account/delete-history', { history_id: current_element.data( 'history-id' ) },
        'json' ).done(
            data => history_row.remove()
        );
} );

$( '#btn-trash-all' ).on( 'click', event =>
{
    $.post( '/account/empty-history', 'json' ).done(
        data => location.reload()
    );
} );

$( '.btn-read' ).on( 'click', event =>
{
    let current_element = $( event.target );
    if ( current_element.prop( 'tagName' ) != 'BUTTON' )
        current_element = current_element.parent();
    const chapter_id = current_element.data( 'chapter-id' ),
        comic_id = current_element.data( 'comic-id' );
    window.location = location.href.split( '/' )[ 0 ] + `/comic/${ comic_id }/${ chapter_id }`;
} );