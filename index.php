<?php
function strGray($str) { return "<span style='color:gray;'>".$str."</span>";}
if ( !function_exists("gzdecode") ) {
    function gzdecode($data) {  return gzinflate(substr($data,10,-8)); } 
}
$ua=$_SERVER['HTTP_USER_AGENT'];
$boxsize=200;

if (isset($_REQUEST['type'])) {

    switch ( $_REQUEST['type'] ) {
     
        case "png_dl64gz":
            header("Content-Type: image/png;");
            header('Content-Disposition: Attachment; filename="'.$_REQUEST['png_filename'].'.png"');
            echo gzdecode(base64_decode(urldecode($_REQUEST['png_dl64gz'])));
            exit;
        break;
        
        case "p2dx_json":
            header("Content-Type: text/json;");
            header('Content-Disposition: Attachment; filename="file.alljson"');
            echo  stripslashes($_REQUEST['p2dx_json']);
            exit;
        break;
        
        default:
        case "plist_xml":
            header("Content-Type: text/xml;");
            header('Content-Disposition: Attachment; filename="'.$_REQUEST['png_filename'].'.plist"');
            echo urldecode($_REQUEST['plist_xml']);
            exit;
        break;
        
    }
    
}

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="ja" lang="ja" dir="ltr" xmlns:og="http://ogp.me/ns#" xmlns:mixi="http://mixi-platform.com/ns#" xmlns:fb="http://www.facebook.com/2008/fbml">
<head>

<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="description" content="ParticleEditor for cocos2dx. WebBased. Win&Mac.">

<meta property="og:title" content="Particle2dx" />
<meta property="og:type" content="tool" />
<meta property="og:url" content="http://particle2dx.com/" />
<meta property="og:locale" content="ja_JP" />
<meta property="og:image" content="http://particle2dx.com/thumbnail.png" />
<meta property="og:site_name" content="ParticleEditor for cocos2dx. WebBased. Win&Mac." />
<meta property="og:description" content="ParticleEditor for cocos2dx. WebBased. Win&Mac." />

<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
<script>
	boxsize=<?=$boxsize?>;
</script>
<title>Particle2dx</title>
<style>
body{
	color: #bbbbbb;
	font-size:80%;
	background-color:#222222;	
}
<? if (preg_match("/chrome/i",$ua)) {?>
input{
	background-color:#dddddd;
	opacity:0.7;	
}
<? } ?>
h3{
	color:white;
	border-bottom:1px solid #444444;
}
h4{
	color:#cccccc;
	border-bottom:1px solid #444444;
	margin:5px;
}
.shortc{
	color:#88bbbb;	
}

a:link {color: #88ccff;text-decoration: none; }
a:visited {color: #88ccff;text-decoration: none;}
a:hover {color: #88ccff;text-decoration: underline;}

.headchar {color: #5588cc;text-decoration: none; font-size:110%;}

</style>
</head>
<body>

<!-- facebook -->
<div id="fb-root"></div>
<script>
(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/ja_JP/all.js#xfbml=1&appId=254469811382518";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
</script>

<?
if (preg_match("/(iphone|ipod|android)/i",$ua)){
   	exit ("sorry ,now it doesn't work on mobilePhone. <br/>use WinPC/Mac!");
}
if (!preg_match("/(Chrome|safari|firefox)/i",$ua)){
   	exit ("sorry ,now it doesn't work on IE & mobilePhone. <br/>use WinPC/Mac & Chrome/Safari/Firefox");
}

$_SESSION['builtin']="Fire"; 
$_SESSION['png_name']='_s_fire'; // トラバーサル対策 dir入力を許さない

$plist_temp = file_get_contents("particle/template.plist");
$plist_template = htmlentities($plist_temp,ENT_QUOTES,"utf-8");

$plist_64=base64_encode($plist_temp);

//$plist_template = nl2br(htmlentities($plist_template,ENT_QUOTES,"utf-8"));
?>
<div style="background-color:#333333;padding:3px;border-bottom:1px solid #444444;padding-left:10px;">
	 <span style="font-size:170%;font-weight:bold;color:white;" >Particle2dx</span>
	 design particle for cocos2dx.
	 <script>
	    function topPaneToggle(p_name){
	    	if (p_name=="tutorial"){
		    	$('#top_pane_shortcut').hide();
	    	}else{
		    	$('#top_pane_tutorial').hide();
	    	}
		    $('#top_pane_'+p_name).slideToggle(100);
	    }
	 </script> 
	 <a href="javascript:topPaneToggle('tutorial');">tutorial</a>
	 <a href="javascript:topPaneToggle('shortcut');">shortcut</a>
	 <a href="https://www.facebook.com/particle2dx" target="_blank">fb_page</a>
	 <a href="doc.html" target="_blank">doc_jp</a>
	 
	 &nbsp; &nbsp; &nbsp; &nbsp;
	 <!-- facebook -->
	 <div class="fb-like" data-href="http://particle2dx.com/" data-layout="button_count" data-action="like" data-show-faces="true" data-share="true"></div>
</div>

<div id="top_pane_tutorial" style="padding:20px;font-size:15px;  border-bottom:1px solid #444444;   display:none;" >
	<h4>30 Second Tutorial</h4>
	<div style="padding-left:20px;">
		<span class="shortc">1</span> Press T - Open Template Panel<br/>
		<span class="shortc">2</span> Click Template to Apply to Screen<br/>
		<span class="shortc">3</span> Press C - Open Color&Shape Panel<br/>
		<span class="shortc">4</span> Click Any Shape or Color<br/>
		<span class="shortc">5</span> Press M - Open Motion Panel<br/>
		<span class="shortc">6</span> On [Motion] Panel , Move any slider <br/>
		<span class="shortc">7</span> Press P - download PList (for cocos2dx) <br/>
	</div>
</div>

<div id="top_pane_shortcut" style="padding:20px;font-size:15px;  border-bottom:1px solid #444444;  display:none;" >
	<table >
		<tr><td style="vertical-align:top;" width="200">
		
			<h4>Panel</h4>
			 &nbsp;&nbsp;   <span class="shortc">T</span> &nbsp; Template <br/>
			 &nbsp;&nbsp;   <span class="shortc">C</span> &nbsp; Color&Shape <br/>
			 &nbsp;&nbsp;   <span class="shortc">I</span> &nbsp; InOut<br/>
			 
		</td><td style="vertical-align:top;" width="200">
		
			<h4>Edit particle</h4>
			 &nbsp;&nbsp; <span class="shortc">←→</span> &nbsp; Rotate<br/>
			 &nbsp;&nbsp; <span class="shortc">↑↓</span> &nbsp; Scaling<br/>
			 &nbsp;&nbsp; <span class="shortc">D</span> &nbsp; Duplicate<br/>
			 &nbsp;&nbsp; <span class="shortc">S</span> &nbsp; Snapshot<br/>
			 &nbsp;&nbsp; <span class="shortc">P</span> &nbsp; Plist download<br/>
			 
		</td><td style="vertical-align:top;" width="200">	
			
			<h4>Emitter Type</h4>
			 &nbsp;&nbsp; <span class="shortc">G</span> &nbsp; Gravity<br/>
			 &nbsp;&nbsp; <span class="shortc">R</span> &nbsp; Radius<br/>
			 
		</td><td style="vertical-align:top;" >
		
			<h4>Multi emitter</h4>
			 &nbsp;&nbsp; <span class="shortc">A</span>   &nbsp; Add emitter<br/>
			 &nbsp;&nbsp; <span class="shortc">1-9</span> &nbsp; Show(select)/hide emitter<br/>
			 &nbsp;&nbsp; <span class="shortc">0</span>   &nbsp; Hide all emitters<br/>
			 
		</td></tr>
	</table>
</div>

		<table><tr>
		<td style="vertical-align:top;padding:10px;" >
				<!-- canvas -->
					<div>
					    <span id="canvas_size_x" style="font-size:170%;font-weight:bold;" >**</span>x<span id="canvas_size_y" style="font-size:170%;font-weight:bold;" >**</span>
						
						&nbsp; 
					    	<script>
					    	setCSize=function(x,y,id){
						    	cc.EGLView.getInstance().setDesignResolutionSize(x,y, cc.RESOLUTION_POLICY.SHOW_ALL);
						    	$("#canvas_size_x").html(x);
						    	$("#canvas_size_y").html(y);
						    	$("a[id^=res_size_]").css('font-weight','');
						    	$("#"+id).css('font-weight','bold');
					    	} 
					    	</script>
					    
					    	<a id="res_size_3" href="javascript:setCSize(320,480 ,'res_size_3'); setGrid($('#grid').val());" >3GS</a>     		    	
					    	<a id="res_size_4" href="javascript:setCSize(640,960 ,'res_size_4'); setGrid($('#grid').val());" >iPhone4</a>

						<br/>
					    pos <span id="emitter_posi">**</span>
	
						<span id="isActive">**</span>
					
					</div>
					<div style="border:1px solid #444444;">
						<canvas id="gameCanvas" width="320" height="480"></canvas>
					</div>
					<a href="javaScript:toggleStats();">Stats</a>
					<a href="javaScript:toggleGrid();">Grid</a> 
					
					<input type="range" id="grid" name="grid" min="20" max="160" step="10" value="100" 
					onMouseMove="
						if (!flg_mousedown) return;
						setGrid(this.value);
						$('#grid_disp').html(this.value+'px');
						">
					
					<span id="grid_disp" >**</span> 
					
					
					
					<br/><Br/>				

					<h3 style="color:gray;">BackGround</h3>
					
					<table id="palette_bg" cellspacing=1 border=0 ><tr>
						    <? 
						    for($i=3;$i<=15;$i=$i+3) { 
						    	echo "<tr>";
								for($j=3;$j<=15;$j=$j+3) { 
									for($k=3;$k<=15;$k=$k+3) { 							    
								?>
								<td col="bg" title="#<?=dechex($i*256+$j*16+$k);?>" 
								style="background-color:#<?=dechex($i*256+$j*16+$k);?>;width:8px;height:8px;font-size:6px;">&nbsp;
								</td>
								<?  }
							    } 
							    echo "</tr>";
					        } ?>
					</tr></table>	
					alpha<input type="range" id="bg_alpha" min=0 max=1 step="0.01" value=1 
						onMouseMove="
							if (!flg_mousedown) return;
							setBGColor(bg_col,this.value);"
					/>


					<script>
					   var bg_col="rgb(0,0,0)";
					   $("td[col=bg]").bind("mousedown",function(){ 
					   	  bg_col=$(this).css("background-color");
					   	  $("#bg_alpha").val(1);
					   	  setBGColor(bg_col,1);
					   });
					   function setBGColor(p_bg_col,p_alpha){
							p_bg_col = p_bg_col.replace("rgb(","");
							p_bg_col = p_bg_col.replace(")","");
							p_ary = p_bg_col.split(",");
					   	   col_3b= cc.c3b(p_ary[0],p_ary[1],p_ary[2]);
					   	   col_4f=cc.c4FFromccc3B(col_3b);
					   	   col_4f=cc.c4f(p_ary[0]/255,p_ary[1]/255,p_ary[2]/255,p_alpha);
					   	   
					   	   //drawnodeを作り四角で塗りつぶす
					   	   size = cc.Director.getInstance().getWinSize();
					   	   if (typeof(bg_node) != "undefined") {
					   	   		bg_node.removeFromParent();
					   	   		bg_node=null;
					   	   }
					   	   bg_node=cc.DrawNode.create();
					   	   bg_node.drawPoly([cc.p(0,0),cc.p(size.width,0),cc.p(size.width,size.height),cc.p(0,size.height)] , 
					   	   				col_4f, 2, col_4f);
						   layers=cc.Director.getInstance().getRunningScene().getChildren();
						   layers[0].addChild(bg_node,0);							   
						   
						   
					   }
					   
					</script>


					
					
					<!--a href="javaScript:toggleDebug();">DebugOnScreen</a-->

					
					<!--BG<input type="text" id="bg_color" value="#000000" placeholder="BGColor" onMouseMove="alert('set color'); "> -->

<!--

	<a href="http://www.cocos2d-x.org/reference/native-cpp/V3.0alpha1/db/dd9/classcocos2d_1_1_particle_system.html">CCParticleAPI</a> <br/>
	<a href="https://github.com/cocos2d/cocos2d-x/blob/f042edd31b61ac53192f3fcd0d97b67374b69475/cocos/2d/CCParticleSystem.cpp">plist:CCParticleSystem.cpp</a> <br/>


	textureImageData = png > gzip > base64<br/>
	textureFileName = TextureCacheのキー名になる<br/>
	同じキー名のパーティクルを読み込むとテクスチャが上書き<br/>
	<br/>
-->
</td><td style="vertical-align:top;">

<div style="border-bottom:1px solid #444444;">

	<div id="slots">
		** slots **
	</div>

	<span id="current_slot" style="font-size:180%;font-weight:bold;color:white;">**</span> &nbsp;&nbsp;&nbsp;
	
	<a href="javascript:removeSlot(slot);">Remove</a> 
	<a href="javascript:removeOtherSlot(slot);">RemoveOther</a>
	<a href="javascript:duplicateSlot(slot);">Duplicate</a>
	<a href="javascript:getSnapshot();" >Snapshot</a>
	<span id="snapshots" ></span>
	<a href="javascript:clrSnapshot();" style="color:#dddddd;">clear</a>
	<br/>
	
	<!--
		VariationCopy 
		<a href="javascript:color9Slot(slot);">18Cols</a> 
		<a href="javascript:size4Slot(slot);">4size</a> 
		<a href="javascript:speed4Slot(slot);">4Speeds</a>	
	-->
	
	
	<div stylr="font-size:140%;">
	
	<a id="panelink_shape"    href="javascript:toggleTopleftPane('shape');"    style="font-size:140%;">
	<strong><span class="headchar">C</span>olor&Shape</strong></a> &nbsp;
	<a id="panelink_motion"   href="javascript:toggleTopleftPane('motion');"   style="font-size:140%;">
	<strong><span class="headchar">M</span>otion</strong></a> &nbsp;
	<a id="panelink_template" href="javascript:toggleTopleftPane('template');" style="font-size:140%;">
	<strong><span class="headchar">T</span>emplate</strong></a> &nbsp;
	<a id="panelink_template" href="javascript:toggleTopleftPane('import');"   style="font-size:140%;">
	<strong><span class="headchar">I</span>nOut</strong></a>
	
	</div>


</div>	
<br/>

<script>
	function toggleTopleftPane(name){
		$("div[id^=topleft_pane_]").hide();		
		$("#topleft_pane_"+name).slideToggle(100);
	}
</script>


<div id="topleft_pane_import" style="display:none;margin-left:20px;" >
	
	<div style="padding-left:20px; ">	
	
		<h4>Import</h4>
		&nbsp; &nbsp; Plist as text(ParticleDesignerType)<input type="plist_import" size="15" placeholder="Plist(PerticleDesigner)" onBlur="if (this.value) {xmlStr2emitter(this.value,slot); }" />
		<br/>
		&nbsp; &nbsp; AllEmitterJson as text<input type="p2dx_import" size="15" placeholder="p2dx" onBlur="if (this.value) {decodeP2DX(this.value); }" />
		<br/><br/>


	<h4>Export</h4>
	&nbsp; &nbsp; 
	<a id="dl" href="javascript:
			document.form_post_dl.type.value='plist_xml';
			document.form_post_dl.plist_xml.value=encodeURIComponent(xml);
			document.form_post_dl.submit();" >Plist</a>

	<a id="p2dx_export" href="javascript:
							document.form_post_dl.type.value='p2dx_json';
							$('#p2dx_out').text(JSON.stringify(xmls)).html(); 
							$('#p2dx_json').attr('value',JSON.stringify(xmls));  
							document.form_post_dl.submit(); " >AllEmitter</a>
	<br/><br/>

	<h4>Separated Export</h4>
		<form name="form_post_dl" method="post" >
			<input type="hidden" name="type" id="type" />
			<input type="hidden" name="p2dx_json" id="p2dx_json" />
			<input type="hidden" name="plist_xml" id="plist_xml" />
			<input type="hidden" name="png_dl64gz" id="png_dl64gz" />
			&nbsp; &nbsp; name<input type="text" name="png_filename" id="png_filename" value="particleTexture" />
			&nbsp; &nbsp; <a href="javascript:downloadPlistNoImg(slot);">plist</a> <a href="javascript:downloadPng(slot);">png</a>
		</form>			
	</div>
	
	
	
</div>


<div id="topleft_pane_template" style="padding-left:20px; display:none;" >
	
	<table>
	<? 
	foreach (array("BG","Water","Fire","FireWorks","Explosion","Meteor","Snow","Click","Smoke","Magic") as $val) { 
		
		echo "<tr><td>";
		echo "<strong>".$val."</strong>";
		echo "</td><td>";

		$ary=explode("\n", trim(`ls plist | grep -i '${val}_' | grep -i 'plist'`));
		foreach ($ary as $val1){
			echo '<a href="javascript:getPlist('."'".$val1."'".')">'.preg_replace("/(.*?_)(.*)(\..*)/","$2",$val1)."</a> ";
		}
		echo "</td><td>";
		echo " MultiEmitter ";
		
		$ary2=array();
		$ary2=explode("\n", trim(`ls plist | grep -i '${val}_' | grep -i 'p2dx'`));
		foreach ($ary2 as $val2){
			echo '<a href="javascript:getP2dx('."'".$val2."'".')">'.preg_replace("/\..*/","",$val2)."</a> ";
		}
		echo "</td></tr> ";
	} 
	?>
	</table>
</div>

<div id="topleft_pane_shape" style="margin-left:20px; display:none;" >

	<h3 style="color:gray;">Shape</h3>
	<?
	foreach (array("Fire","Fireworks","Sun","Galaxy","Flower","Meteor",
					"Spiral","Explosion","Smoke","Snow","Rain") as $val){
		?>
		<!--a href='javascript:changeEmit1("<?=$val?>",slot);'><?=$val?></a--> <?
	}
	?>			
	
	<!-- texture -->
	<script>
		function setTex(name){
			var myTexture = cc.TextureCache.getInstance().addImage("png/"+name+".png");//元画像を用意
			emitter[slot].setTexture(myTexture);
			png_binary_ary[slot]=  cc.Codec.Base64.decode(base64decode(png_gz_b64[name]));
			png_gz_b64[slot]=png_gz_b64[name];
			dumpToInputTag(slot);//inputタグに書き出す
		}
	</script>
	<?
		//echo `pwd`;
		$pngs= explode("\n",trim(`ls res/png/Normal | grep -i 'png'`));
		foreach ($pngs as $val){
			$val=preg_replace("/(.*)(\..*)/",'$1',trim($val));
			echo "<a href='javascript:setTex(".'"'.$val.'"'.");'" ;     
			if ($_SESSION['png_name']==$val) echo " style='font-weight:bold' ";
			
			echo ">";
			//echo $val.'<br/>';
			echo '<img src="res/png/Normal/'.$val.'.png" alt="'.$val.'" /></a>';
			
			$png_path= 'res/png/Normal/'.$val.'.png';
			$png_binary=file_get_contents($png_path);
			$gzip=gzencode($png_binary);
			$png_gz_base64[$val]=base64_encode($gzip);
		}
		
		$json_gz_b64_png= json_encode($png_gz_base64);
	?>

<br/>

	<h3 style="color:gray;">Color</h3>

<table><tr><td style="vertical-align:top;">
	
		<img id="main_pic" src="res/png/Normal/<?=$_SESSION['png_name']?>.png"/> <br/>
		<div id="start_color" style="font-size:10px;" >startcol</div>	
	</td><td style="vertical-align:top;">
		
		
		
		<table id="palette" cellspacing=1 border=0 ><tr>
			    <? 
			    for($i=3;$i<=15;$i=$i+3) { 
			    	echo "<tr>";
					for($j=3;$j<=15;$j=$j+3) { 
						for($k=3;$k<=15;$k=$k+3) { 							    
					?>
					<td col="col" title="#<?=dechex($i*256+$j*16+$k);?>" style="background-color:#<?=dechex($i*256+$j*16+$k);?>;width:8px;height:8px;font-size:6px;">&nbsp;
					</td>
					<?  }
				    } 
				    echo "</tr>";
		        } ?>
		</tr></table>
		
	<script>
	   var palette_col;
	   $("td[col=col]").bind("mousedown",function(){ 
	   	  palette_col=$(this).css("background-color");
	   	  $("#start_color").css("background-color",palette_col);
			palette_col = palette_col.replace("rgb(","");
			palette_col = palette_col.replace(")","");
			p_ary = palette_col.split(",");
	   	   col_3b= cc.c3b(p_ary[0],p_ary[1],p_ary[2]);
	   	   col_4f=cc.c4FFromccc3B(col_3b);
	   	   emitter[slot].setStartColor(col_4f);
	   	   //emitter からテキストボックスへ
	   	   dumpToInputTag();
	   });
	</script>
	</td><td style="vertical-align:top;">
	


											
</td></tr></table>

			  Blend 
			  <a id="blend_add"    href="javascript:emitter[slot].setBlendAdditive(true);  dumpToInputTag();">Additive</a> 
			  <a id="blend_normal" href="javascript:emitter[slot].setBlendAdditive(false); dumpToInputTag();">Normal</a> 


<table><tr><td>
	<h3><span style="color:gray;">Start</span></h3>
	
	<script>
		updStartCol=function(){
			emitter[slot].setStartColor(new cc.Color4F(parseFloat($("#start_r").val()),parseFloat($("#start_g").val()),parseFloat($("#start_b").val()),
		   						parseFloat($("#start_a").val())));//r,g,b,a 
		};
		updStartColVar=function(){
			emitter[slot].setStartColorVar(new cc.Color4F(parseFloat($("#start_r_var").val()),parseFloat($("#start_g_var").val()),parseFloat($("#start_b_var").val()),
		   						parseFloat($("#start_a_var").val())));//r,g,b,a
		};
		updEndCol=function(){
			emitter[slot].setEndColor(new cc.Color4F(parseFloat($("#end_r").val()),parseFloat($("#end_g").val()),parseFloat($("#end_b").val()),
		   						parseFloat($("#end_a").val())));//r,g,b,a
		};
		updEndColVar=function(){
			emitter[slot].setEndColorVar(new cc.Color4F(parseFloat($("#end_r_var").val()),parseFloat($("#end_g_var").val()),parseFloat($("#end_b_var").val()),
		   						parseFloat($("#end_a_var").val())));//r,g,b,a
		};
	</script>

			<table>
			<tr><td>
					Size 
			</td><td width="80" >
					<span id="start_size_disp">**</span>
			</td><td>
					<input type="range" id="startSize" name="startSize" mix="0" max="400" onMouseMove="
						if (!flg_mousedown) return;
						emitter[slot].setStartSize(parseFloat(this.value)); dumpToInputTag();" />
					<input type="range" id="startSizeVar" name="startSize" mix="0" max="400" onMouseMove="
						if (!flg_mousedown) return;
						emitter[slot].setStartSizeVar(parseFloat(this.value)); dumpToInputTag();" />
			</td></tr>
			<tr><td>
				Spin 
			</td><td>
				<span id="start_spin_disp" >**</span>  
			</td><td>
				<input type="range" id="startSpin" name="startSpin" min="-1440" max="1440" value="" 
				onMouseMove="
					if (!flg_mousedown) return;
					emitter[slot].setStartSpin(parseFloat(this.value));dumpToInputTag();" />
				<input type="range" id="startSpin_var" name="startSpin_var" min="0" max="1440" value="" 
				onMouseMove="
					if (!flg_mousedown) return;
					emitter[slot].setStartSpinVar(parseFloat(this.value));dumpToInputTag();" />		
			</td></tr>
			<tr><td>																
					a 
			</td><td>
				<span id="start_a_disp">**</span> 
			</td><td>
				<input type="range" id="start_a" name="start_a" mix="0" max="1" step="0.05" onMouseMove="
					if (!flg_mousedown) return;
					$('img[id*=start_size_pic]').css('opacity',this.value);
					updStartCol(); 
					dumpToInputTag();" />
				 <input type="range"  id="start_a_var" name="start_a_var"  mix="0" max="1" step="0.05" onMouseMove="updStartColVar(); dumpToInputTag();" /> 
			</td></tr>
			<tr><td>
						r 
			</td><td>
				<span id="start_r_disp">**</span>   
			</td><td>
				<input type="range" size="5" id="start_r"     name="start_r"      mix="0" max="1" step="0.05" onMouseMove="
				if (!flg_mousedown) return;
				updStartCol();     dumpToInputTag();" />
				<input type="range" size="5" id="start_r_var" name="start_r_var"  mix="0" max="1" step="0.05" onMouseMove="
				if (!flg_mousedown) return;
				updStartColVar();  dumpToInputTag();" />	
			</td></tr>
			<tr><td>					
						g 
			</td><td>
				<span id="start_g_disp">**</span>
			</td><td>
				<input type="range" size="5" id="start_g"     name="start_g"      mix="0" max="1" step="0.05" onMouseMove="
				if (!flg_mousedown) return;
				updStartCol();     dumpToInputTag();" />
				<input type="range" size="5" id="start_g_var" name="start_g_var"  mix="0" max="1" step="0.05" onMouseMove="
				if (!flg_mousedown) return;
				updStartColVar();  dumpToInputTag();" /> <br/>
			</td></tr>
			<tr><td>	
						b 
			</td><td>
						<span id="start_b_disp">**</span>   
			</td><td>
				<input type="range" size="5" id="start_b"     name="start_b"      mix="0" max="1" step="0.05" 
				onMouseMove="
					if (!flg_mousedown) return;
					updStartCol();     dumpToInputTag();" />
				<input type="range" size="5" id="start_b_var" name="start_b_var"  mix="0" max="1" step="0.05" 
				onMouseMove="
					if (!flg_mousedown) return;
					updStartColVar();  dumpToInputTag();" /> <br/>
			</td></tr>
			</table>
	
		</td><td style="vertical-align:top;" width="50%">

			<h3><span style="color:gray;">End</span></h3>
			
			<table>
			<tr><td>		
					Size 
			</td><td td width="80" >
					<span id="end_size_disp">**</span>
			</td><td>
					<input type="range" id="endSize" name="endSize" mix="0" max="400" 
					onMouseMove="
						if (!flg_mousedown) return;
						emitter[slot].setEndSize(parseFloat(this.value)); dumpToInputTag();" />
					<input type="range" id="endSizeVar" name="endSize" mix="0" max="400" 
					onMouseMove="
						if (!flg_mousedown) return;
						emitter[slot].setEndSizeVar(parseFloat(this.value)); dumpToInputTag();" />
			</td></tr>
			<tr><td>
				Spin 
			</td><td>
				<span id="end_spin_disp" >**</span>  
			</td><td>
				<input type="range" id="endSpin" name="endSpin" min="-1440" max="1440" value="" 
				onMouseMove="
					if (!flg_mousedown) return;
					emitter[slot].setEndSpin(parseFloat(this.value));dumpToInputTag();" />
				
				<input type="range" id="endSpin_var" name="endSpin_var" min="0" max="1440" value="" 
				onMouseMove="
					if (!flg_mousedown) return;
					emitter[slot].setEndSpinVar(parseFloat(this.value));dumpToInputTag();" />		
				
			</td></tr>
			<tr><td>
					a
			</td><td>
					<span id="end_a_disp">**</span>	
			</td><td>	
						<input type="range" id="end_a" name="end_a" min="0" max="1" step="0.05" 
						onMouseMove="
							if (!flg_mousedown) return;
							$('#img[id*=end_size_pic]').css('opacity',this.value); updEndCol(); dumpToInputTag();" />
					    <input type="range" size="5" id="end_a_var" name="end_a_var" min="0" max="1" step="0.05"  
					    onMouseMove="
					    	if (!flg_mousedown) return;
					    	updEndColVar();  dumpToInputTag();" /> <br/>
			</td></tr>
			<tr><td>
						r     
			</td><td>
						<span id="end_r_disp">**</span>	 
			</td><td>
						<input type="range" size="5" id="end_r"     name="end_r"      mix="0" max="1" step="0.05" 
						onMouseMove="
							if (!flg_mousedown) return;
							updEndCol();     dumpToInputTag();" />
						 <input type="range" size="5" id="end_r_var" name="end_r_var" mix="0" max="1" step="0.05" 
						 onMouseMove="
						 	if (!flg_mousedown) return;
						 	updEndColVar();  dumpToInputTag();" /> <br/>
			</td></tr>
			<tr><td>
						g 
			</td><td>    
						<span id="end_g_disp">**</span>	 
			</td><td>
						<input type="range" size="5" id="end_g"     name="end_g"      mix="0" max="1" step="0.05" 
						onMouseMove="
							if (!flg_mousedown) return;
							updEndCol();     dumpToInputTag();" />
						 <input type="range" size="5" id="end_g_var" name="end_g_var" mix="0" max="1" step="0.05" 
						 onMouseMove="
						 	if (!flg_mousedown) return;
						 	updEndColVar();  dumpToInputTag();" /> <br/>
			</td></tr>
			<tr><td>
						b     
			</td><td>
						<span id="end_b_disp">**</span>	 
			</td><td>
						<input type="range" size="5" id="end_b"     name="end_b"      mix="0" max="1" step="0.05" 
						onMouseMove="
							if (!flg_mousedown) return;
							updEndCol();     dumpToInputTag();" />
						 <input type="range" size="5" id="end_b_var" name="end_b_var" mix="0" max="1" step="0.05" 
						 onMouseMove="
						 	if (!flg_mousedown) return;
						 	updEndColVar();  dumpToInputTag();" /> <br/>
			</td></tr>
			</table>

		</td></tr>
		<tr><td style="vertical-align:top;">
			</td><td style="vertical-align:top;">				
		
				<div id="end_color">endcolor</div>
						
		</td></tr>				
		</table>


	ColorVariance
	<a id="cv_1" href="javascript:setColorInit(); dumpToInputTag();">0%</a> 
	<a id="cv_2" href="javascript:
				emitter[slot].setStartColorVar(  cc.c4f(0.1,0.1,0.1,0.5)  ); 
				emitter[slot].setEndColor(emitter[slot].getStartColor()); 
				emitter[slot].setEndColorVar(  cc.c4f(0,0,0,0) ); 
				dumpToInputTag();">10%</a>
	<a id="cv_3" href="javascript:
				emitter[slot].setStartColorVar(  cc.c4f(0.2,0.2,0.2,0.5) ); 
				dumpToInputTag();">20%</a>
	<a id="cv_4" href="javascript:
				emitter[slot].setStartColorVar(  cc.c4f(0.4,0.4,0.4,0.5) ); 
				dumpToInputTag();">40%</a>
	
	<a id="cv_5" href="javascript:    
				emitter[slot].setStartColorVar(cc.c4f(1,1,1,1));  
				dumpToInputTag();">100%</a> 								
	<br/>

	</div><!-- pane_shape -->

	<div id="topleft_pane_motion" style="margin-left:20px; ">
	
		<div style="border-bottom:1px solid #444444;">
			<h4>
			<a id="type_grav" href="javascript:toggleGravityRadius('gravity',slot);" style="font-size:140%;" >Gravity</a>    
			<a id="type_rad"  href="javascript:toggleGravityRadius('radius',slot);"  style="font-size:140%;" >Radius</a> 
			</h4>
		
			<table >
				<tr><td>
					Duration
				</td><td width="80" >
					<span id="duration_disp" >**</span> sec 
				</td><td>
					<input type="range" id="duration" name="duration" min="-1" max="10" step="0.02" 
					onMouseMove="
						if (!flg_mousedown) return;
						emitter[slot].setDuration(parseFloat(this.value));
						emitter[slot].resetSystem();
						dumpToInputTag();" />
					<span id="duration_forever_disp" >**</span>
					
					<a  href="javascript:emitter[slot].setDuration(-1);   dumpToInputTag();">Forever</a>
					<a  href="javascript:emitter[slot].setDuration(0.01); dumpToInputTag();">0.01</a> 				
					<a  href="javascript:emitter[slot].setDuration(0.05); dumpToInputTag();">0.05</a> 					
					<a  href="javascript:emitter[slot].setDuration(0.5);  dumpToInputTag();">0.5</a> 
					
				</td></tr>
				
				<tr><td>		
					Lifetime 
				</td><td>
					<span id="life_disp" >**</span>
				</td><td>
					<input type="range" id="life" name="life" min="0" max="10" step="0.05" 
						onMouseMove="
								if (!flg_mousedown) return;
								emitter[slot].setLife(parseFloat(this.value));
								emitter[slot].setTotalParticles(emitter[slot].getEmissionRate()*emitter[slot].getLife());
								dumpToInputTag(); " />
					<input type="range" id="lifeVar" name="lifeVar" min="0" max="10" step="0.1"
							onMouseMove="
								if (!flg_mousedown) return;
								emitter[slot].setLifeVar(parseFloat(this.value));
								dumpToInputTag(); " />
				</td></tr>	
				<tr><td>
					EmissionRate 
				</td><td>
						<span id="emit_rate_disp" >**</span>
				</td><td>
				<input id="emissionRate" name="emissionRate" type="range" min="0" max="800" 
				onMouseMove="
					if (!flg_mousedown) return;
					emitter[slot].setEmissionRate(this.value);																										emitter[slot].setTotalParticles(emitter[slot].getEmissionRate()*emitter[slot].getLife());
					dumpToInputTag();"/>
				</td></tr>
				<tr><td>				
						Angle 
						</td><td width="80" >
							<span id="angle_disp" >**</span>
						</td><td>
							<input id="angle" type="range" guide="1" min="-180" max="180" step="1"
								onMouseMove="
										if (!flg_mousedown) return;
										emitter[slot].setAngle(parseInt(this.value)); 
										setGuideObj(slot);
										guiderect[slot].setVisible(true);   
										drawAngle(slot ,emitter[slot].getAngle(),emitter[slot].getSpeed()); 
										dumpToInputTag(slot); "/>
							<input id="angle_var" type="range" guide="1" min="0" max="180" step="1"
								onMouseMove="
										if (!flg_mousedown) return;
										emitter[slot].setAngleVar(parseInt(this.value));
										setGuideObj(slot); 
										guiderect[slot].setVisible(true);
										drawAngle(slot,emitter[slot].getAngle(),emitter[slot].getSpeed()); 
										dumpToInputTag(slot);"/>
				</td></tr>				
			</table>	
		</div>

		<div id="pane_gravity">
		
		<table><tr><td style="vertical-align:top;" >
				Angle 
				<span id="disp_angle">**</span> Speed <span id="disp_speed">**</span><br/>		
				<canvas id="cv_angle" style="border:solid 1px; width:<?=$boxsize?>px; height:<?=$boxsize?>px;">
				</canvas>

			
			<script>
				var angle_x=0,angle_y=0,angle_flag=0;

			    var cv_angle = document.getElementById('cv_angle');
			    var ctx_angle = cv_angle.getContext('2d');
					cv_angle.setAttribute("width", boxsize);
					cv_angle.setAttribute("height",boxsize);
					ctx_angle.scale( 1,1 );	
								    
				function drawAngle(p_slot,kakudo,speed){

					kakudo=parseInt(kakudo);
					speed=parseInt(speed);

					cc.log("drawAngle p_slot:"+p_slot+ " emitters:"+emitter.length + " angle:" + kakudo + " speed:" + speed);
					
					this.rad=parseFloat(kakudo * Math.PI / 180 );

					//線を引く
					ctx_angle.clearRect(0,0,boxsize,boxsize);				
					
					to_x=boxsize/2 + Math.cos(this.rad) * speed / 10;
					to_y=boxsize/2 - Math.sin(this.rad) * speed / 10;
					//speed,angle
					ctx_angle.beginPath();
					ctx_angle.strokeStyle=' rgb(255,88,88) ';
					ctx_angle.moveTo(boxsize/2,boxsize/2);
					ctx_angle.lineTo(to_x , to_y);
					ctx_angle.closePath();
					ctx_angle.stroke();
					
					//angleVarの円弧
					ctx_angle.beginPath();
					anglevar=parseInt(emitter[p_slot].getAngleVar());
					rad_from = round2((kakudo - anglevar) * Math.PI / 180 * -1);
					rad_to = round2((kakudo + anglevar) * Math.PI / 180 * -1);
					cc.log(" kakudo:"+kakudo+" anglevar:"+anglevar+" radian from:"+rad_from+" to:"+rad_to);
					ctx_angle.arc(boxsize/2, boxsize/2, 30,rad_from,rad_to, true); // x , y , 半径 , 開始度ラジアン , 終了度ラジアン , true
					ctx_angle.stroke();
					
					//speedVar
					this.spdVar=emitter[p_slot].getSpeedVar();
					ctx_angle.beginPath();
					ctx_angle.strokeStyle=' rgb(150,150,150) ';
					ctx_angle.moveTo(to_x - Math.cos(this.rad) * this.spdVar / 10 + Math.sin(this.rad) *3, to_y + Math.sin(this.rad) * this.spdVar / 10 + Math.cos(this.rad) *3);
					ctx_angle.lineTo(to_x + Math.cos(this.rad) * this.spdVar / 10 + Math.sin(this.rad) *3, to_y - Math.sin(this.rad) * this.spdVar / 10 + Math.cos(this.rad) *3);
					ctx_angle.closePath();					

					ctx_angle.stroke();
				}
				
				$("#cv_angle").bind("mousedown",function(e){
					angle_flag=1;
				});
				$("#cv_angle").bind("mousemove",function(e){
					if (angle_flag==0) { return; }
					off=$("#cv_angle").offset();
					rect = e.target.getBoundingClientRect();
					
                	angle_x = e.clientX - rect.left - boxsize/2;
					angle_y = e.clientY - rect.top  - boxsize/2;

					angle_x=Math.floor(angle_x * 10);
					angle_y=Math.floor(angle_y * 10);

					kakudo = Math.floor(Math.atan2(angle_y,angle_x) * 180 / Math.PI ) * -1;
					speed  = Math.floor(Math.sqrt(angle_x * angle_x + angle_y * angle_y));
					cc.log ("speed:"+ speed);

					emitter[slot].setSpeed(speed);
					emitter[slot].setAngle(kakudo);
					$("#speed").attr("value",speed);
					dumpToInputTag(slot);
				});
				$("#cv_angle").bind("mouseup",function(e){
					angle_flag=0;
					dumpToInputTag(slot);
				});
			</script>
			<br/>


		</td><td style="vertical-align:top;">

			EmitArea <span id="emit_area">** x **</span><br/>
			<canvas id="set_pos" style="border:solid 1px; width:<?=$boxsize?>px; height:<?=$boxsize?>px;">
			</canvas>
			<br/>
			<a href="javascript:emitter[slot].setPosVar(cc.p(0,0));     dumpToInputTag(slot);">0x0</a>
			<a href="javascript:emitter[slot].setPosVar(cc.p(160,5));   dumpToInputTag(slot);">Hor</a>			
			<a href="javascript:emitter[slot].setPosVar(cc.p(5,240));   dumpToInputTag(slot);">Ver</a>						
			<a href="javascript:emitter[slot].setPosVar(cc.p(160,240)); dumpToInputTag(slot);">320x480</a>
			
			<script>
				var emit_x=0,emit_y=0,emit_flag=0;

			    var cv = document.getElementById('set_pos');
			    var emit_ctx = cv.getContext('2d');
					cv.setAttribute("width", boxsize);
					cv.setAttribute("height",boxsize);
					emit_ctx.scale( 1,1 );	
			    
				function drawEmitArea(p_slot,xx,yy){

					xx=Math.floor(xx);
					yy=Math.floor(yy);
					$("#emit_area").html(" " +  Math.abs(xx *2) + " " + Math.abs(yy *2)  ); //プラスマイナスつくので2倍サイズ
					guiderect[p_slot].setScaleX(xx *2 / 100);
					guiderect[p_slot].setScaleY(yy *2 / 100);

					//四角を描く
					emit_ctx.clearRect(0,0,boxsize,boxsize);				
					emit_ctx.beginPath();
					emit_ctx.strokeStyle=' rgb(255,88,88) ';
					emit_ctx.strokeRect(boxsize/2 - Math.floor( xx/5  ) , boxsize/2 - Math.floor(yy / 5 ),  Math.floor(xx/5) * 2 ,  Math.floor(yy / 5) *2 );
					emit_ctx.closePath();
					emit_ctx.stroke();
				}
				
				$("#set_pos").bind("mousedown",function(e){
					emit_flag=1;
					guiderect[slot].setVisible(true);
				});
				$("#set_pos").bind("mousemove",function(e){
					if (emit_flag==0) { return; }
					off=$("#set_pos").offset();
					
					rect = e.target.getBoundingClientRect();
                	emit_x = Math.abs(e.clientX - rect.left - boxsize/2) * 5;
					emit_y = Math.abs(e.clientY - rect.top  - boxsize/2) * 5;					

					emitter[slot].setPosVar(cc.p( parseInt(emit_x)  , parseInt(emit_y) ));
					drawEmitArea( slot , emit_x , emit_y );
					dumpToInputTag(slot);
				});
				$("#set_pos").bind("mouseup",function(e){
					emit_flag=0;
					guiderect[slot].setVisible(false);
					dumpToInputTag(slot);
				});
			</script>

		</td><td style="vertical-align:top;">
		
			Gravity <span id="grav_01">** x **</span><br/>
			<canvas id="grav_pad" style="border:solid 1px; width:<?=$boxsize?>px; height:<?=$boxsize?>px;">
			</canvas>
			<script>
			    var cv_grav = document.getElementById('grav_pad');
			    var ctx_grav = cv_grav.getContext('2d');
				var grav_x=0,grav_y=0,grav_flag=0;
					cv_grav.setAttribute("width", boxsize);
					cv_grav.setAttribute("height",boxsize);
					ctx_grav.scale( 1,1 );
				
				function drawGrav(p_slot,xx,yy){
					xx=Math.floor(xx);
					yy=Math.floor(yy);
					$("#grav_01").html(" " + xx + " " + yy );
					
					emitter[p_slot].setGravity(cc.p( xx , yy ));
					
					//中心から線を引く
					ctx_grav.clearRect(0,0,boxsize,boxsize);				
					ctx_grav.beginPath();
					ctx_grav.strokeStyle=' rgb(255,88,88) ';
					ctx_grav.moveTo(boxsize/2,boxsize/2);
					ctx_grav.lineTo(boxsize/2+ xx/20 , boxsize/2 - yy / 20);
					ctx_grav.closePath();
					ctx_grav.stroke();
				}
				$("#grav_pad").bind("mousedown",function(e){
					grav_flag=1;
				});
				$("#grav_pad").bind("mousemove",function(e){
					if (grav_flag==0) { return; }
					off=$("#grav_pad").offset();
					
					rect = e.target.getBoundingClientRect();
                	grav_x = (e.clientX - rect.left - boxsize/2) ;
					grav_y = (e.clientY - rect.top  - boxsize/2) * -1;					
					
					drawGrav(slot,grav_x*20,grav_y*20);
					dumpToInputTag(slot);
				});
				
				$("#grav_pad").bind("mouseup",function(e){
					grav_flag=0;
					dumpToInputTag(slot);
				});
			</script>
			<br/>			
			<a href="javascript:drawGrav(slot,0,0);dumpToInputTag(slot);">OFF</a> 
			<a href="javascript:drawGrav(slot,emitter[slot].getGravity().x * 0.8,emitter[slot].getGravity().y * 0.8);  dumpToInputTag(slot);">80%</a> 
			<a href="javascript:drawGrav(slot,emitter[slot].getGravity().x * 1.2,emitter[slot].getGravity().y * 1.2);  dumpToInputTag(slot);">120</a> 
			<a href="javascript:drawGrav(slot,emitter[slot].getGravity().x * 1.5,emitter[slot].getGravity().y * 1.5);  dumpToInputTag(slot);">150</a>
	</td></tr></table>
	
	<div style="margin:5px;">
	Speed 
	<a  href="javascript:emitter[slot].setSpeed(emitter[slot].getSpeed()*2); 
															emitter[slot].setRadialAccel(emitter[slot].getRadialAccel()*2);     
															emitter[slot].setTangentialAccel(emitter[slot].getTangentialAccel()*2);    
															dumpToInputTag();">x2</a> 	
	<a  href="javascript:emitter[slot].setSpeed(emitter[slot].getSpeed()/2); 
															emitter[slot].setRadialAccel(emitter[slot].getRadialAccel()/2);     
															emitter[slot].setTangentialAccel(emitter[slot].getTangentialAccel()/2);    
															dumpToInputTag();">/2</a>		
    &nbsp;&nbsp;				

	Rotate
	<a href="javascript:rotateSlot(slot,10)">10</a>
	<a href="javascript:rotateSlot(slot,90)">90</a>			
	</div>
			
	<table><tr><td>
		
		<table>
			<tr><td>
				Speed 
			</td><td width="80" >
				<span id="speedVar_disp" >**</span>			
			</td><td>
				<input type="range" id="speed"    name="speed"    guide="1" min="0" max="600" 
				onMouseMove="
					if (!flg_mousedown) return;
					emitter[slot].setSpeed(parseFloat(this.value));
					dumpToInputTag(slot);" />
				<input type="range" id="speedVar" name="speedVar" guide="1" min="0" max="600" 
				onMouseMove="
					if (!flg_mousedown) return;
					emitter[slot].setSpeedVar(parseFloat(this.value));
					dumpToInputTag(slot);" />
			</td></tr>
			
			<tr><td>
				PosVar 
			</td><td>
				<span id="pos_var_disp" >**</span>
			</td><td>
			
				<input id="pos_var_x" name="pos_var_x" type="range" guide="1" min="0" max="800" 
				   onMouseMove="
				   		if (!flg_mousedown) return;
				   		emitter[slot].setPosVar(cc.p(parseInt(this.value)　,parseInt(emitter[slot].getPosVar().y)));
				   		setGuideObj(slot);
						guiderect[slot].setVisible(true); 
						dumpToInputTag(slot);"/>
				<input id="pos_var_y" name="pos_var_y" type="range" guide="1" min="0" max="800"
				　 onMouseMove="
						if (!flg_mousedown) return;
						emitter[slot].setPosVar(cc.p(parseInt(emitter[slot].getPosVar().x),parseInt(this.value)));
						setGuideObj(slot);
						guiderect[slot].setVisible(true); 
						dumpToInputTag(slot);"/>
			</td></tr>			
			
			<tr><td>
				Gravity
			</td><td>
				<span id="gravity_disp" >**</span>
			</td><td>

				<input id="gravity_x" name="gravity_x" type="range" guide="1" min="-1200" max="1200" 
								onMouseMove="
									if (!flg_mousedown) return;
									emitter[slot].setGravity(cc.p(this.value,emitter[slot].getGravity().y)); 
								    dumpToInputTag(slot);"/>
				<input id="gravity_y" name="gravity_y" type="range" guide="1" min="-1200" max="1200" 
								onMouseMove="
									if (!flg_mousedown) return;
									emitter[slot].setGravity(cc.p(emitter[slot].getGravity().x,this.value));
								    dumpToInputTag(slot);"/>
			</td></tr>			
		</table>

	</td><td style="vertical-align:top;" >
		<table >
				<tr><td>	 
						AccelRad  
				</td><td>		
						<span id="rad_accel_disp">**</span> 
				</td><td>
						<input type="range" id="rad_accel" name="rad_accel"  min="-800" max="600"  
						onMouseMove="
							if (!flg_mousedown) return;
							emitter[slot].setRadialAccel(parseFloat(this.value)); 
							dumpToInputTag(); " />
						 <input type="range" id="rad_accel_var" name="rad_accel_var" min="0" max="600" 
						  	onMouseMove="
						  		if (!flg_mousedown) return;
								emitter[slot].setRadialAccelVar(parseFloat(this.value)); 
								dumpToInputTag();" />
				</td></tr>
				<tr><td>			
						AccelTan 	
				</td><td>
						<span id="tan_accel_disp">**</span> 
				</td><td>
					<input type="range" id="tan_accel" name="tan_accel" min="-800" max="800"   
						onMouseMove="
							if (!flg_mousedown) return;
							emitter[slot].setTangentialAccel(parseFloat(this.value)); 
							dumpToInputTag(); " />
						
					 <input type="range" id="tan_accel_var" name="tan_accel_var" min="0" max="600" 
						 onMouseMove="
						 	if (!flg_mousedown) return;
						 	emitter[slot].setTangentialAccelVar(parseFloat(this.value)); 
						 	dumpToInputTag();" /> 	
				</td></tr>
			</table>	
	</td></tr></table>				 		
	</div><!-- pane_gravity -->

	<div id="pane_radius" style="display:none;">
			
			<table><tr><td>
					MaxRadius 
			</td><td width="80" >
				<span id="max_radius_disp">**</span>
			</td><td>			
					<input type="range" id="maxRadius" name="maxRadius" guide="1" min="0" max="1000" 
					onMouseMove="
						if (!flg_mousedown) return;
						emitter[slot].setStartRadius(parseFloat(this.value)); 
						setGuideObj(slot);
						guiderect[slot].setVisible(true); 
						dumpToInputTag(slot);" />
					<input type="range" id="maxRadiusVar" name="maxRadiusVar" guide="1" min="0" max="1000" 
					onMouseMove="
						if (!flg_mousedown) return;
						emitter[slot].setStartRadiusVar(parseFloat(this.value)); 
						setGuideObj(slot);
						guiderect[slot].setVisible(true); 
						dumpToInputTag(slot);" 
					/><?=strGray("発生位置:px"); ?>		
			</td></tr>			
			<tr><td>
					MinRadius 
			</td><td>
				<span id="min_radius_disp">**</span>
			</td><td>
					<input type="range" id="minRadius" name="minRadius" guide="1" min="0" max="1000" 
						onMouseMove="
							if (!flg_mousedown) return;
							emitter[slot].setEndRadius(parseFloat(this.value)); 
							setGuideObj(slot);
							guiderect[slot].setVisible(true); 
							dumpToInputTag(slot);" /><?=strGray("終了位置:px"); ?>
			</td></tr>
			<tr><td>
					Rotate/Sec
			</td><td>
					<span id="rotate_par_second_disp">**</span>
			</td><td>
					 <input type="range" id="rotatePerSecond" name="rotatePerSecond" guide="1" min="-1000" max="1000"    
					 onMouseMove="
					 	if (!flg_mousedown) return;
					 	emitter[slot].setRotatePerSecond(parseFloat(this.value)); 
					 	dumpToInputTag(slot);
					 	guiderect[slot].setVisible(true); "/>
					 <input type="range" id="rotatePerSecondVar" name="rotatePerSecondVar" guide="1" min="0" max="1000"           
					 onMouseMove="
					 	if (!flg_mousedown) return;
					 	emitter[slot].setRotatePerSecondVar(parseFloat(this.value)); 
					 	dumpToInputTag(slot);
					 	guiderect[slot].setVisible(true); "  /><?=strGray("円周に沿った回転量"); ?>
			</td></tr>
			</table>

			<script src="cocos2d.js"></script>

			<script>
				var flg_mousedown=0;
				var slot=0;
				var png_gz_b64=<?=$json_gz_b64_png ?>;
				var xml_base64='<?=$plist_64?>';
				var png_name=[];
				png_name[slot]="<?=$_SESSION['png_name']?>";
				var emitter=[];
				
				$("input[type=range]").bind( 'mousedown' ,function(){ 
					flg_mousedown=1; console.log("mousedown"); 
				});
				$("input[type=range]").bind( 'mouseup', function(){ 
					flg_mousedown=0; guiderect[slot].setVisible(false); console.log("mouseup"); 
				});
			</script>

</div><!-- pane_radius -->
</div><!-- pane_motion -->

</td></tr></table>

<div style="margin-left:10px;">

	<a id="panelink_template" href="javascript:$('#plist_out').slideToggle(100);" style="font-size:80%;" >RealtimePList</a>
	
	<div id="plist_out" style="display:none;">
		<h3>Plist  <span id="plist_changed" style="font-size:10px;">***</span>  </h3>
		<pre id="plist" style="font-size:70%;margin-left:20px;"></pre>
		<img id="img_check" />
		<pre id="p2dx_out" style="font-size:70%;margin-left:20px;"></pre>
	</div>
	
</div>

</body>
</html>