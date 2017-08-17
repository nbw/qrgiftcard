<h1>QR Giftcard Web-app: Front-end</h1>


<p>
The QR Giftcard Web-app is a tool to create/manage giftcards and was developed for local businesses in Victoria, Canada. It utilzes QR codes which redirect to a locally hosted server.
</p>

<h2>This repository only includes the front-end code.</h2>

<h2>* * * * * * * * * * * * * * * * * <a href="http://qrgiftcard.nathanwillson.com/"> The demo can be found here </a> * * * * * * * * * * * * * * * * *</h2>



<p>
The app is comprised of two webpages:

<ol>
<li>Giftcard page to be used by a restaurant server</li>
<li>Admin page for adjusting settings, collecting statistics, and managing/creating giftcards</li>
</ol>
(screenshots available at bottom)
</p>


<h3>App Features</h3>
<ul>
<li>Dynamic user interface optimized for iPad</li>
<li>Customizable price buttons for giftcard page</li>
<li>'PIN input key' mode to track servers</li>
<li>Create/Modify/Disable/Transfer/Recover Giftcards</li>
<li>Obtain daily statistics for checkout</li>
<li>Each id/transaction is encrypted </li>
</ul>

<h2>Front-end</h2>
<p>
  The front-end is divided into an <b>index.liquid</b>, <b>style.scss</b>, <b>myknockout.js</b>, <b>myfunctions.js</b> and <b>admin.liquid</b> file. 
</p>
<ul>
<li>HTML/HTML5</li>
<li>CSS/CSS3 written using SASS preproccesor</li>
<li>BOOTSTRAP framework</li>
<li>RESTful API</li>
<li>Includes templating using <a href="http://liquidmarkup.org">Liquid</a></li>
</ul>

<h3>Javascript Dependencies</h3>
<ul>
<li>knockoutjs</li>
<li>jquery</li>
<li>iScroll</li>
<li>fastclick</li>
<li>bootbox</li>
</ul>

<h2>Back-end</h2>
<ul>
<li>Hosted with Ruby</li>
<li>SQL database</li>
<li>Templating using Ruby <a href="http://liquidmarkup.org">Liquid</a></li>
<li>RESTful API (Sinatra)</li>
</ul>

<h2>Screenshots</h2>

![ipad screenshot](/images/ipad4.png?raw=true)

![admin screenshot](/images/admin1.png?raw=true)

<h2>License</h2>

<p>
This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
</p>

<p>
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
</p>

<p>
You should have received a copy of the GNU General Public License along with this program. If not, see http://www.gnu.org/licenses/.
</p>


