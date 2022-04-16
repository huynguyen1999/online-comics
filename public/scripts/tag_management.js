$( document ).on( 'click', '.btn-edit', event =>
{
    let current_element = $( event.target );
    if ( current_element.prop( 'tagName' ) != 'BUTTON' )
        current_element = current_element.parent();
    const btn_save = current_element.siblings( '.btn-save' );
    const input_tag_name = current_element.parent()
        .siblings( '.input-tag-name' ).children( 'input' );
    input_tag_name.attr( 'readonly', false );
    current_element.prop( 'hidden', true );
    btn_save.prop( 'hidden', false );
} );

$( document ).on( 'click', '.btn-save', event =>
{
    let current_element = $( event.target );
    if ( current_element.prop( 'tagName' ) != 'BUTTON' )
        current_element = current_element.parent();
    const btn_edit = current_element.siblings( '.btn-edit' );
    const input_tag_name = current_element.parent().siblings( '.input-tag-name' ).children( 'input' );
    const tag_id = current_element.data( 'tag-id' ),
        tag_name = input_tag_name.val();
    console.log( tag_name );
    $.post( '/admin/update-tag', { tag_id: tag_id, tag_name: tag_name }, 'json' ).done( data =>
    {
        if ( data )
        {
            console.log( data );
            current_element.prop( 'hidden', true );
            btn_edit.prop( 'hidden', false );
            input_tag_name.attr( 'readonly', true );
            alert( `Tag with ID = ${ tag_id } has been edited!` );
        }
        else alert( `Failed edit!` );
    } );
} );

$( document ).on( 'click', '.btn-remove', event =>
{
    let current_element = $( event.target );
    if ( current_element.prop( 'tagName' ) != 'BUTTON' )
        current_element = current_element.parent();
    const tag_row = current_element.parentsUntil( 'tbody' );
    const tag_id = current_element.data( 'tag-id' );
    $.post( '/admin/remove-tag', { tag_id: tag_id }, 'json' )
        .done( data =>
        {
            if ( data )
            {
                tag_row.remove();
                alert( `Tag with ID = ${ tag_id } has been removed!` );
            }
            else alert( 'Failed removal!' );
        } );
} );

$( document ).on( 'click', '#btn_add_tag', event =>
{
    let current_element = $( event.target );
    if ( current_element.prop( 'tagName' ) != 'BUTTON' )
        current_element = current_element.parent();
    const tags_body = $( '#tags_body' );
    const new_tag_name = current_element.siblings( 'input' ).val();
    $.post( '/admin/add-tag', { tag_name: new_tag_name }, 'json' )
        .done( data =>
        {
            if ( data )
            {
                const new_tag_id = data.insertId;
                tags_body.append(
                    `<tr>
                        <th scope="col" class="px-5">${ new_tag_id }</th>
                        <td scope="col" class="input-tag-name">
                            <input type="text" class="border-0" value="${ new_tag_name }" readonly>
                        </td>
                        <td scope="col">
                            <button type="button" data-tag-id="${ new_tag_id }"
                                class="btn p-0 mx-1 btn-save" hidden> 
                                <i class="bi bi-check-circle-fill"></i>
                            </button>
                            <button type="button" data-tag-id="${ new_tag_id }"
                                class="btn p-0 mx-1 btn-edit">
                                <i class="bi bi-pen-fill"></i>
                            </button>
                            <button type="button" data-tag-id="${ new_tag_id }"
                                class="btn p-0 mx-1 btn-remove">
                                <i class="bi bi-x-circle-fill"></i>
                            </button>
                        </td>
                    </tr>`);
                alert( `New Tag = ${ new_tag_name } has been created!` );
            }
            else alert( 'Add tag failed!' );
        } );
} );