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
    const author_element = $( '#author-col' );
    const current_author_name = current_element.data( 'author-name' );
    author_element.html( `<input type="text" value="${ current_author_name }"/>` );
    $( '#btn-save-author' ).prop( 'hidden', false );
    current_element.prop( 'hidden', true );
} );

$( document ).on( 'click', '#btn-save-author', event =>
{
    let current_element = $( event.target );
    if ( current_element.prop( 'tagName' ) != 'BUTTON' )
        current_element = current_element.parent();
    const author_element = $( '#author-col' );
    const new_author_name = author_element.children( 'input' ).val();
    const comic_id = current_element.data( 'comic-id' );
    $.post( '/publisher/edit-author',
        { author_name: new_author_name, comic_id: comic_id },
        'json' ).done(
            data =>
            {
                if ( data )
                {
                    author_element.html(
                        `<a href="/authors/${ data.new_author_id }"
                        class="text-decoration-none">
                        ${ new_author_name }
                        </a>`
                    );
                    current_element.prop( 'hidden', true );
                    $( '#btn-edit-author' ).prop( 'hidden', false );
                    alert( `New author = ${ new_author_name }` );
                } else alert( 'Failed author change!' );
            }
        );
} );

$( document ).on( 'click', '#btn-edit-status', event =>
{
    let current_element = $( event.target );
    if ( current_element.prop( 'tagName' ) != 'BUTTON' )
        current_element = current_element.parent();
    const status_element = $( '#status-col' );
    const current_status_id = current_element.data( 'comic-status' );
    const current_status = current_status_id == 1 ? 'Ongoing' : 'Finished';
    const new_status = current_status_id == 1 ? 'Finished' : 'Ongoing';
    const new_status_id = current_status_id == 1 ? -1 : 1;
    status_element.html(
        `<select class="form-select border-0">
            <option value="${ current_status_id }">${ current_status }</option>
            <option value="${ new_status_id }">${ new_status }</option>
        </select>`);
    $( '#btn-save-status' ).prop( 'hidden', false );
    current_element.prop( 'hidden', true );
} );

$( document ).on( 'click', '#btn-save-status', event =>
{
    let current_element = $( event.target );
    if ( current_element.prop( 'tagName' ) != 'BUTTON' )
        current_element = current_element.parent();
    const status_element = $( '#status-col' );
    const new_status_id = status_element.children( 'select' ).val();
    const comic_id = current_element.data( 'comic-id' );
    $.post( '/publisher/edit-status', { status_id: new_status_id, comic_id: comic_id }, 'json' )
        .done( data =>
        {
            if ( data )
            {
                $( '#btn-edit-status' ).prop( 'hidden', false );
                current_element.prop( 'hidden', true );
                status_element.html( new_status_id == 1 ? 'Ongoing' : 'Finished' );
                alert( 'Success update status' );
            } else alert( 'Failed status update!' );
        } );
} );

$( document ).on( 'click', '#btn-edit-likes', event =>
{
    let current_element = $( event.target );
    if ( current_element.prop( 'tagName' ) != 'BUTTON' )
        current_element = current_element.parent();
    const likes_element_input = $( '#comic_likes' ).children( 'input' );
    likes_element_input.prop( 'readonly', false );
    $( '#btn-save-likes' ).prop( 'hidden', false );
    current_element.prop( 'hidden', true );
} );

$( document ).on( 'click', '#btn-save-likes', event =>
{
    let current_element = $( event.target );
    if ( current_element.prop( 'tagName' ) != 'BUTTON' )
        current_element = current_element.parent();
    const likes_element_input = $( '#comic_likes' ).children( 'input' );
    const comic_likes = +likes_element_input.val();
    const comic_id = current_element.data( 'comic-id' );
    $.post( '/publisher/edit-likes', { comic_likes: comic_likes, comic_id: comic_id },
        'json' ).done( data =>
        {
            if ( data )
            {
                likes_element_input.prop( 'readonly', true );
                current_element.prop( 'hidden', true );
                $( '#btn-edit-likes' ).prop( 'hidden', false );
                alert( 'Success update likes!' );
            }
            else alert( 'Failed update likes!' );
        } );
} );

$( document ).on( 'click', '#btn-edit-follows', event =>
{
    let current_element = $( event.target );
    if ( current_element.prop( 'tagName' ) != 'BUTTON' )
        current_element = current_element.parent();
    const follows_element_input = $( '#comic_follows' ).children( 'input' );
    follows_element_input.prop( 'readonly', false );
    $( '#btn-save-follows' ).prop( 'hidden', false );
    current_element.prop( 'hidden', true );
} );

$( document ).on( 'click', '#btn-save-follows', event =>
{
    let current_element = $( event.target );
    if ( current_element.prop( 'tagName' ) != 'BUTTON' )
        current_element = current_element.parent();
    const follows_element_input = $( '#comic_follows' ).children( 'input' );
    const comic_follows = +follows_element_input.val();
    const comic_id = current_element.data( 'comic-id' );
    $.post( '/publisher/edit-follows', { comic_follows: comic_follows, comic_id: comic_id },
        'json' ).done( data =>
        {
            if ( data )
            {
                follows_element_input.prop( 'readonly', true );
                current_element.prop( 'hidden', true );
                $( '#btn-edit-follows' ).prop( 'hidden', false );
                alert( 'Success update follows!' );
            }
            else alert( 'Failed update follows!' );
        } );
} );

$( document ).on( 'click', '#btn-add-tag', event =>
{
    let current_element = $( event.target );
    if ( current_element.prop( 'tagName' ) != 'BUTTON' )
        current_element = current_element.parent();
    $( '#btn-save-tag' ).prop( 'hidden', false );
    $( '#select-add-tag' ).prop( 'hidden', false );
    current_element.prop( 'hidden', true );
} );

$( document ).on( 'click', '#btn-save-tag', event =>
{
    let current_element = $( event.target );
    if ( current_element.prop( 'tagName' ) != 'BUTTON' )
        current_element = current_element.parent();
    const new_tags = $( '#select-add-tag' ).val();
    const new_tags_name = $( '#select-add-tag' ).find( 'option:selected' ).text();
    const comic_id = current_element.data( 'comic-id' );
    const tags_row = $( '#comic-tags' );

    $.post( '/publisher/add-tag', { comic_id: comic_id, new_tags: new_tags }, 'json' )
        .done( data =>
        {
            if ( data )
            {
                const tags_html = "";
                for ( const tag of new_tags )
                {
                    const [ tag_id, tag_name ] = tag.split( '-' );
                    tags_row.append(
                        `
                        <div class="tag-element col-3">
                            <a href="/tags/${ tag_id }"
                                class="btn text-warning bg-light border border-warning ms-3 my-1 btn-tag"
                            >
                                ${ tag_name }
                            </a>
                            <button data-tag-id="${ tag_id }"
                            class="btn p-1 btn-outline-primary btn-remove-tag" >
                                <i class="bi bi-dash"></i>
                            </button>
                        </div>`);
                }
                alert( 'Tag add successed!' );
            }
            else alert( 'Add tag failed!' );
        } );
} );

$( '#select-add-tag' ).click( ( event ) =>
{
    let current_element = $( event.target );
    if ( current_element.prop( "tagName" ) != 'SELECT' )
        return;
    const comic_id = current_element.data( 'comic-id' );
    $.getJSON( `/comic/${ comic_id }/other-tags` )
        .done( data =>
        {
            let options = "";
            for ( const tag of data )
                options += `<option value="${ tag.t_ID }-${ tag.t_Name }">${ tag.t_Name }</option>`;

            current_element.html( options );
        } );
} );

$( document ).on( 'click', '.btn-remove-tag', event =>
{
    let current_element = $( event.target );
    if ( current_element.prop( 'tagName' ) != 'BUTTON' )
        current_element = current_element.parent();
    const tag_element = current_element.parent();
    const comic_id = current_element.data( 'comic-id' );
    const tag_id = current_element.data( 'tag-id' );
    $.post( '/publisher/remove-tag', { tag_id: tag_id, comic_id: comic_id }, 'json' ).done(
        data =>
        {
            if ( data )
            {
                tag_element.remove();
                alert( 'Successed removal' );
            }
            else alert( 'Failed removal' );
        }
    );
} );

$( document ).on( 'click', '#btn-edit-description', event =>
{
    let current_element = $( event.target );
    if ( current_element.prop( 'tagName' ) != 'BUTTON' )
        current_element = current_element.parent();

    const btn_save = $( '#btn-save-description' );
    const input_description = $( '#text-description' );
    input_description.prop( 'readonly', false );
    btn_save.prop( 'hidden', false );
    current_element.prop( 'hidden', true );
} );

$( document ).on( 'click', '#btn-save-description', event =>
{
    let current_element = $( event.target );
    if ( current_element.prop( 'tagName' ) != 'BUTTON' )
        current_element = current_element.parent();

    const comic_id = current_element.data( 'comic-id' );
    const input_description = $( '#text-description' );
    const text_description = input_description.val();

    $.post( '/publisher/edit-description', { description: text_description, comic_id: comic_id } )
        .done( data =>
        {
            if ( data )
            {
                input_description.prop( 'readonly', true );
                current_element.prop( 'hidden', true );
                $( '#btn-edit-description' ).prop( 'hidden', false );
                alert( 'Description update successed!' );
            } else alert( 'Description update failed!' );
        } );
} );

$( document ).on( 'click', '.btn-remove-chapter', event =>
{
    let current_element = $( event.target );
    if ( current_element.prop( 'tagName' ) != 'BUTTON' )
        current_element = current_element.parent();
    const comic_id = current_element.data( 'comic-id' ),
        chapter_id = current_element.data( 'chapter-id' ),
        chapter_no = current_element.data( 'chapter-no' );
    const chapter_row = current_element.parentsUntil( '.chapter-container' );
    $.post( '/publisher/remove-chapter',
        { comic_id: comic_id, chapter_id: chapter_id, chapter_no: chapter_no },
        'json' ).done(
            data =>
            {
                if ( data )
                {
                    chapter_row.remove();
                    alert( 'Chapter removal successed!' );
                }
                else alert( 'Chapter removal failed!' );
            } );
} );

$( '#btn-remove-comic' ).on( 'click', event =>
{
    let current_element = $( event.target );
    if ( current_element.prop( 'tagName' ) != 'BUTTON' )
        current_element = current_element.parent();
    const comic_id = current_element.data( 'comic-id' ),
        user_id = current_element.data( 'user-id' );
    $.post( '/publisher/remove-comic', { comic_id: comic_id, user_id: user_id }, 'json' )
        .done( data =>
        {
            if ( data )
            {
                location.reload();
                alert( 'Success comic removal!' );
            }
            else alert( 'Failed comic removal!' );
        } );
} );