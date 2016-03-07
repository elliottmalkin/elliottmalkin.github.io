window.addEvent('domready', function() {
    if (window.location.hash &&
        window.location.hash.indexOf('comment') == 1) {
        scrollToComments();
    }
});

function enlargeImage() {
	/* document.getElementById('submit_comment').className=''; */
    if (document.getElementById('show_comments')) { 
        document.getElementById('show_comments').className='';
    }
    document.getElementById('exhibit').className = 'large';
    document.getElementById('description').className = 'hide';
}

function shrinkImage() {
    document.getElementById('exhibit').className = '';
    document.getElementById('description').className = '';
}

function scrollToComments() {
    $('submit_comment').className = 'show';
    if ($('show_comments')) { 
        $('show_comments').className = 'show';
    }
    setTimeout(function() {
        var scroll = new Fx.Scroll(window, {
            wait: false,
            duration: 500,
            transition: Fx.Transitions.Quad.easeOut
        });
        if ($('show_comments')) {
            var y = $('show_comments').getPosition().y;
        } else {
            var y = $('submit_comment').getPosition().y;
        }
        scroll.scrollTo(0, y - 15);
    }, 0);
}