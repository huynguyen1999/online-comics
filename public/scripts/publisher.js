
const url_dict = {
    'btn-name': '/publisher/edit-name',
    'btn-author': '/publisher/edit-author',
    'btn-status': '/publisher/edit-status',
    'btn-likes': '/publisher/edit-likes',
    'btn-follows': '/publisher/edit-follows',
    'btn-add-tag': '/publisher/add-tag',
    'btn-remove-tag': '/publisher/remove-tag',
    'btn-description': '/publisher/edit-description',
    'btn-chapter': '/publisher/edit-chapter'
};

$( document ).on( 'click', '#btn-edit-name', event =>
{
    let current_element = $( event.target );
    if ( current_element.prop( 'tagName' ) != 'BUTTON' )
        current_element = current_element.parent();
    current_element.prop( 'hidden', true );
    const btn_save = $( '#btn-save-name' );
    btn_save.prop( 'hidden', false );
    const input_name = current_element.siblings( 'input' );
    input_name.prop( 'readonly', false );
} );

$( document ).on( 'click', '#btn-save-name', event =>
{
    let current_element = $( event.target );
    if ( current_element.prop( 'tagName' ) != 'BUTTON' )
        current_element = current_element.parent();
    const comic_id = current_element.data( 'comic-id' );
    const input_name = current_element.siblings( 'input' );

    $.post( '/publisher/edit-name', { comic_id: comic_id, comic_name: input_name.val() }, 'json' )
        .done( data =>
        {
            if ( data )
            {
                const btn_edit = $( '#btn-edit-name' );
                btn_edit.prop( 'hidden', false );
                current_element.prop( 'hidden', true );
                input_name.prop( 'readonly', true );
                alert( `Comic named change to ${ input_name.val() }` );
            }
            else alert( 'failed name change!' );
        } );
} );

$( document ).on( 'click', '#btn-edit-author', event =>
{
    let current_element = $( event.target );
    if ( current_element.prop( 'tagName' ) != 'BUTTON' )
        current_element = current_element.parent();
        
} );

$( '#btn-remove-comic' ).on( 'click', event =>
{

} );