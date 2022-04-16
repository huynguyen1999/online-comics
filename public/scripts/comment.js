$( '#btn_comment' ).on( 'click', () =>
{
    const user_id = $( '#comment_text' ).data( 'user-id' ),
        chapter_id = $( '#comment_text' ).data( 'chapter-id' ),
        comment_text = $( '#comment_text' ).val();
    console.log( comment_text );
    $.post( '/comic/comment', { user_id, chapter_id, comment_text }, 'json' )
        .done( data =>
        {
            if ( data )
            {
                console.log( data );
                $( '#comment_container' ).prepend(
                    `<div class="d-flex my-2 comment-box">
                        <img src="/public/images/avatar.png" width="40" height="40" class="rounded-circle" >
                        <div class="mx-3 w-100 rounded border">
                            <div class=" mx-3 my-1">
                                <span class="text-primary fw-bold">${ data.user_name }</span>
                                <span class="mx-3 text-dark bold">Chapter ${ data.ch_No }</span>
                                <span class="mx-3 text-secondary">${ data.cmt_Time }</span>
                            </div>
                            <div class="text-comment d-flex">
                            <textarea class="w-100 mx-2 border-0 px-3 rounded-0" readonly>${ data.cmt_Text }</textarea>
                            <button type="button" data-comment-id="${ data.comment_id }" 
                                class="btn btn-outline-primary btn-comment btn-save" hidden>
                                <i class="bi bi-check"></i>
                            </button>
                            <button type="button"  class="btn btn-outline-primary btn-comment btn-edit">
                                <i class="bi bi-vector-pen"></i>
                            </button>
                            <button type="button" data-comment-id="${ data.comment_id }"  
                                class="btn btn-outline-primary btn-comment btn-delete">
                                <i class="bi bi-x"></i>
                            </button>
                            </div>       
                        </div>
                    </div>`
                );
            };
        } );
} );
$( document ).on( 'click', '.btn-edit', ( event ) =>
{
    // icon
    let current_element = $( event.target );
    if ( current_element.prop( 'tagName' ) != 'BUTTON' )
        current_element = current_element.parent();

    const btn_save = current_element.siblings( '.btn-save' );
    const text_area = current_element.siblings( 'textarea' );
    text_area.prop( 'readonly', false );
    btn_save.prop( 'hidden', false );
    current_element.prop( 'hidden', true );
} );

$( document ).on( 'click', '.btn-delete', ( event ) =>
{
    let current_element = $( event.target );
    if ( current_element.prop( 'tagName' ) != 'BUTTON' )
        current_element = current_element.parent();
    const comment_id = $( current_element ).data( 'comment-id' );

    $.post( '/comic/uncomment', { cmt_ID: comment_id }, 'json' ).done( result =>
    {
        if ( result )
        {
            const comment_box = current_element.parentsUntil( '#comment_container' );
            comment_box.remove();
        }
        else alert( "Can't uncomment!" );
    } );
} );


$( document ).on( 'click', '.btn-save', ( event ) =>
{
    let current_element = $( event.target );
    if ( current_element.prop( 'tagName' ) != 'BUTTON' )
        current_element = current_element.parent();
    const btn_edit = current_element.siblings( '.btn-edit' );
    const text_area = current_element.siblings( 'textarea' );
    // post request
    $.post( '/comic/edit-comment',
        { cmt_Text: text_area.val(), cmt_ID: current_element.data( 'comment-id' ) },
        'json' ).done( result =>
        {
            if ( result )
            {
                btn_edit.prop( 'hidden', false );
                current_element.prop( 'hidden', true );
            }
            else alert( "Can't edit somehow!" );
        } );
} );