<?php
/*
Template Name: art
*/
?>

<html>

<head>
<title>The Orange Nude by Roberta Malkin</title>
<script src="/mint/?js" type="text/javascript"></script>
<link rel="stylesheet" type="text/css"
href="http://www.dziga.com/mother/art.css"/>
<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
<meta name="description" content="A drawing made by Roberta Malkin in the 1970's is discovered on the Goodwill auction site."/>
<link rel="pingback" href="<?php bloginfo('pingback_url'); ?>" />
</head>

<body>

<div id="chunk">

<p><img src="http://www.dziga.com/mother/auction2.jpg"><br><br></p>

<p>A few days ago I received an email from a guy I didn't know named Bob:<br><br></p>

<p class="email">I think this was done by your mother.<br>
Might want to pick it up.  Very good work and it caught my eye. Bob<br><br></p>

<p>He included a <a href="http://www.shopgoodwill.com/auctions/Orange-Nude-by-R-Malkin-6007440.html">link to a Goodwill auction</a>, where I immediately recognized one of my mother's early drawings, at least 30 years old judging by the style. It was being auctioned out of Portland, Oregon &ndash; odd given that my mother (<a href="http://www.flickr.com/photos/lincolnwood/sets/72157611731917312/">Roberta Malkin</a>) has lived and worked her entire life in Chicago.<br><br></p>

<p>Bob continued: <font style="color:#666666;font-style:italic;">I thought from the signature it may have been a <a href="http://en.wikipedia.org/wiki/Peter_Malkin">Peter Z. Malkin</a>, a pretty interesting fellow who caught <a href="http://en.wikipedia.org/wiki/Adolf_Eichmann">Adolf Eichmann</a>.  His cover was that he was an artist.  From the thumbnail I could tell it was very good work.  If you really want it bid high.  It may be sniped at the very end.<br><br></font></p>

<p><img src="http://www.dziga.com/mother/auction3.jpg"><br><br></p>

<p>Bob was right. I wanted to recover it. There were only a few minutes left in the auction and just a single bid at $25. I signed up, bid $100, and with 7 seconds remaining lost it.<br><br></p>

<p>Bob: <font style="color:#666666;font-style:italic;">I told you someone would come over the top.  Contact Portland Goodwill and keep an eye out for it on Ebay. The winner thinks they bought a Peter Z. Malkin. Tell your mother for me that she does fine work, her use of color and the fine detail in abstract is very unique and caught my attention and obviously of others.  If you do not get it then at least feel good with that issue.<br><br></font></p>

<p><img src="http://www.dziga.com/mother/auction1.jpg"><br><br></p>

<p>I was frustrated about the auction but thanked Bob for giving me the tip. Out of curiosity I asked if he was an art dealer or collector.<br><br></p>

<p>Bob: <font style="color:#666666;font-style:italic;">Just a hustler, tryin to make a buck.  My son and I chase art.  I am in NY and he is in Virginia.  Too many people now know about the Goodwill site.  You would not believe some of the artwork that shows up there. A lot of fakes.<br><br>

Goodwill gives their honest opinion but they make mistakes, mostly in identifying the artist. They are good on the condition which helps. The upside is that they are not setting a value and letting the market decide. No one is stealing fine art from them any longer like in the past.<br>Good luck.<br><br></font></p>

<p>At that point I called my mother and told her what occurred:<br><br></p>

<div class="video">
<object width="450" height="60"><param name="allowfullscreen" value="true" /><param name="allowscriptaccess" value="always" /><param name="movie" value="http://vimeo.com/moogaloop.swf?clip_id=9359524&amp;server=vimeo.com&amp;show_title=0&amp;show_byline=0&amp;show_portrait=0&amp;color=#ffffff&amp;fullscreen=1" /><embed src="http://vimeo.com/moogaloop.swf?clip_id=10680029&amp;server=vimeo.com&amp;show_title=0&amp;show_byline=0&amp;show_portrait=0&amp;color=#ffffff&amp;fullscreen=1" type="application/x-shockwave-flash" allowfullscreen="true" allowscriptaccess="always" width="450" height="60"></embed></object><br>
</div>

<p>I then contacted Goodwill at Bob's suggestion. I wrote:<br><br></p>

<p><font style="color:#666666;font-style:italic;">Dear Goodwill, I was informed by a shopgoodwill user that a drawing by mother from the 1970s was being auctioned on the site. I signed up and made a bid significantly higher than the last. I was outbid by $1 at the last moment. I know that this person won the auction fair and square. I just ask if there is a way for me to contact the winner directly so that I may offer to purchase it from him.<br><br></font></p>

<p>Goodwill responded:<br><br></p>

<p><font style="color:#666666;font-style:italic;">Thank you for your email. We apologize, however, we would not be able to share the other buyers personal information. We can certainly pass your information on to them, however. Please let us know the exact message you would like to send them, as well as your contact information, and we will pass it on to the other buyer. Thank you for your support of our mission.<br><br></font></p>

<p>So I asked Goodwill to pass this message on:<br><br></p>

<p><font style="color:#666666;font-style:italic;">Dear Winner of the Orange Nude by R. Malkin (auction 6007440),<br>
My name is Elliott Malkin. I am the son of the artist who made that drawing and I'm interested in purchasing it from you for a reasonable sum. I see that you paid $101. Please contact me at [elliott at dziga dot com] and maybe we can work something out. Best, Elliott<br><br></font></p>

<p>And that's where things currently stand.<br><br></p>

<p>For more about Roberta Malkin, see <a href="http://www.dziga.com/mother">Mother's History of Birds</a>.
<br><br></p>

<p class="email">Posted April 5, 2010. Photos courtesy of Goodwill auctions.<br><br></p>

<?php if (have_posts()) : while (have_posts()) : the_post(); ?>

<div class="post" id="post-<?php the_ID(); ?>">

<?php wp_link_pages(array('before' => '<p><strong>Pages:</strong> ', 'after' => '</p>', 'next_or_number' => 'number')); ?>

</div>
<?php endwhile; endif; ?>
<?php edit_post_link('Edit this entry.', '<p>', '</p>'); ?>


<div id="comments">
<?php comments_template(); ?> 
</div>

</div>

</body>

</html>