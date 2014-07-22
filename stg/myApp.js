/*
bg_node背景色の四角形 0
bg_sprite 2
グリッド 3
emitter 5
guideRect 6
fg_sprte 7

prev_screen(drawnode) 10
prev_emitter 11


*/
var clog=function(str) { 
		//	console.log(str)
};

var plist_changed=0;
var guideC=[];
var emit_timer=[];
var emit_timer_switch=[];

var isAllActive;

var current_reso={};
var current_reso_scale=0.5;
var guiderect=[];
var snap=[];
var json_corona=null;
var xml=null;
var xmls=[];
var dn=0;
var bg_sprite;
var fg_sprite;

var texture1;

var prev_dn; // drawnode rect for Preview Mask
var prev_string;
var current_start_color;


var MyLayer = cc.Layer.extend({

    init:function () {

        this._super();

		var size = cc.Director.getInstance().getWinSize();
		setCSize(resos['iPhone4'],current_reso_scale);//canvas size初期値

        setGrid($('#grid').val());
        
        this.scheduleUpdate();
		this.setTouchEnabled(true);
		this.setKeyboardEnabled(true);
		
		//Mask for preview
		prev_dn=cc.DrawNode.create();
		prev_dn.drawPoly([cc.p(0,0),cc.p(s_size.width,0),cc.p(s_size.width,s_size.height),cc.p(0,s_size.height)] , 
							cc.c4f(0,0,0, 0.8 ), 0, cc.c4f(0,0,0, 1 ));
		layers=cc.Director.getInstance().getRunningScene().getChildren();
		layers[0].addChild(prev_dn,10);
		prev_dn.setVisible(false);
		
        prev_string = cc.LabelTTF.create("Preview", "Arial", 40);//フォント、大きさ
        layers[0].addChild(prev_string, 12);//画面に追加
        prev_string.setPosition(cc.p( 80 , s_size.height - 30 ));//位置
        prev_string.setVisible(false);
        		
		//デフォルトエミッタを作成;
		getPlist("meteor_me3.plist");
		togglePane('template');//初期表示panel
	},
	
	//focusをcocosのcanvasの外に
	onKeyUp:function(keycode)   { 
		clog("onKeyUp:"+keycode); 
		$('#duration').focus();
		//keyShortCut(keycode);
	},
	onKeyDown:function(keycode) { clog("onKeyDown:"+keycode); },	

	onMouseUp:function(e){
		alert(1);
	},

	update:function(dt){
	
		if (emitter.length==0) { return false; }
	
		//selected emitter active check
		if (emitter[slot].isActive()) { 
			$('#isActive').html("true"); 
			$('#isActive').css("color","white");
		}else { 
			$('#isActive').html("false");
			$('#isActive').css("color","red");
		}
		
		//plist [update] sign 
		time= parseInt((new Date)/1);
		if (time - plist_changed <= 200){
			$("#plist_changed").html("<span style='color:red;'>update</span>");
		}else{
			$("#plist_changed").html("<span style='color:gray;'>update</span>");
		}
		
		//count emitter-life and loop
		isAllActive=true;
		for (ind in emitter){
			if (emitter[ind].getDuration()!=-1){
				//count up
				if (emit_timer_switch[ind]==1){
					emit_timer[ind]+=dt;
				// timer start if inactive 
				} else if (!emitter[ind].isActive()){
					emit_timer_switch[ind]=1;
					emit_timer[ind]=0;
				}
				//reset emitter if inactive and 
				if (emit_timer[ind]> emitter[ind].getDuration()+ emitter[ind].getLife() + 0.5){
					emitter[ind].resetSystem();
					emit_timer_switch[ind]=0;
					emit_timer[ind]=0;
				}
			}
		}
		
	},
	onTouchesBegan:function(touch,event){
		clog("began");
		loc = touch[0].getLocation();
		if (slot_bg!=0) {
			moveBGImage(slot_bg,loc);
			return;
		}
		if (touch.length==0) { return false; }//タッチしてなければ戻る(canvas外タッチでも来るので)
		if (emitter.length==0) { return false; }

		emitter[slot].setPosition(loc);
		
		if (!emitter[slot].isActive()) {emitter[slot].resetSystem();}

		
		$("#emitter_posi").html(parseInt(loc.x)+" "+parseInt(loc.y));
		guiderect[slot].setVisible(true);
	},
	onTouchesMoved:function(touch,event){
		clog("onTouchesMoved");
		loc = touch[0].getLocation();
		if (slot_bg!=0) {
			moveBGImage(slot_bg,loc);
			return;
		}
		if (touch.length==0) { return false; } //タッチしてなければ戻る(canvas外タッチでも来るので)
		if (emitter.length==0) { return false; }
		
		emitter[slot].setPosition(loc);
		$("#emitter_posi").html(parseInt(loc.x)+" "+parseInt(loc.y));
	},
	onTouchesEnded:function(touch,event){
		clog("onTouchesEnded");
		loc = touch[0].getLocation();
		if (slot_bg!=0) {
			moveBGImage(slot_bg,loc);
			return;
		}
		if (touch.length==0) { return false; } //タッチしてなければ戻る(canvas外タッチでも来るので)	
		if (emitter.length==0) { return false; }
		
		emitter[slot].setPosition(loc);
		$('#emitter_posi').html(parseInt(loc.x)+" "+parseInt(loc.y));
		guiderect[slot].setVisible(false);
		
		dumpToInputTag(slot);
	}
});

var MyScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new MyLayer();
        this.addChild(layer);
        layer.init();
    }
});



function round1(val1){
	return parseInt(val1*10)/10;
}
function round2(val1){
	return parseInt(val1*100)/100;
}

function setBGSlot(p_num){
	clog("setBGSlot:"+p_num);
	slot_bg=p_num;
	slot=0;
	dumpToInputTag(p_num);
}
function moveBGImage(p_slot_bg,posi){
	clog("moveBGImage");
	if (p_slot_bg==-1){
		bg_sprite.setPosition(posi);
	}
	if (p_slot_bg==-2){
		fg_sprite.setPosition(posi);
	}	
	
}


function setGrid(interval_px){

	clog("setGrid" + interval_px);

	s_size=cc.Director.getInstance().getWinSize();

	gridwidth=1;
	if (s_size.width >= 640) gridwidth=2;
	if (s_size.width >= 1000) gridwidth=3;

	if (dn){
		dn.removeFromParent();
		dn=null;
		delete dn;
	} 

	clog("gridwidth:"+gridwidth);
	dn=cc.DrawNode.create();
	
	//yoko
	for (i=1 ;i<=Math.floor(s_size.height / interval_px);i=i+1){
		dn.drawSegment(cc.p(0,s_size.height - i*interval_px ), cc.p(s_size.width,s_size.height - i*interval_px ),gridwidth, cc.c4f(0.5,0.5,0.5, 0.5 ) );
	}		
	//tate
	for (i=1 ;i<=Math.floor(s_size.width / interval_px);i=i+1){
		dn.drawSegment(cc.p(i*interval_px ,0), cc.p(i*interval_px ,s_size.height),gridwidth, cc.c4f(0.5,0.5,0.5, 0.5 ) );
	}	
	layers=cc.Director.getInstance().getRunningScene().getChildren();
	layers[0].addChild(dn,3);	
}


function dumpToInputTag(p_slot){

		clog("dumpToInputTag slot:"+p_slot);
		refreshSlot();

		//slotなければreturn
		if (emitter.length==0) { return false; }

		if (!p_slot) { p_slot=slot;}

		$('#angle').val(parseInt(emitter[p_slot].getAngle()));		
		$('#angle_text').val(parseInt(emitter[p_slot].getAngle()));		
		$('#angle_var').val(parseInt(emitter[p_slot].getAngleVar()));
		$('#angle_var_text').val(parseInt(emitter[p_slot].getAngleVar()));
			
		$('#angle_disp').html(emitter[p_slot].getAngle()+"±"+emitter[p_slot].getAngleVar());	
		
		$('#duration').val(emitter[p_slot].getDuration());
		$('#duration_text').val(emitter[p_slot].getDuration());		
		
		$('#duration_disp').html(emitter[p_slot].getDuration());
		$("#duration_forever_disp").html(" ");	
		if (emitter[p_slot].getDuration()==-1){
			$("#duration_forever_disp").html("<span style='color:red;' >forever</span>");	
		}
				
		$('#life').val(emitter[p_slot].getLife());
		$('#life_text').val(emitter[p_slot].getLife());		
		$('#lifeVar').val(emitter[p_slot].getLifeVar());		
		$('#lifeVar_text').val(emitter[p_slot].getLifeVar());
		$('#life_disp').html(emitter[p_slot].getLife()+"±"+emitter[p_slot].getLifeVar());

		//start
		start_col=emitter[p_slot].getStartColor(); //c4f   var.r var.g var.b var.a
		$('#start_a').val(round2(start_col.a));
		$('#start_r').val(round2(start_col.r));		
		$('#start_g').val(round2(start_col.g));
		$('#start_b').val(round2(start_col.b));
		$("#start_color").css("background-color","rgba("+start_col.r*100+"%, "+start_col.g*100+"%, "+start_col.b*100+"%, "+round2(start_col.a)+")");
		$("#start_color").html($("#start_color").css("background-color"));	
		
		start_col_var=emitter[p_slot].getStartColorVar(); //c4f type  var.r var.g var.b var.a
		$('#start_a_var').val(start_col_var.a);
		$('#start_r_var').val(start_col_var.r);		
		$('#start_g_var').val(start_col_var.g);
		$('#start_b_var').val(start_col_var.b);

		$('#start_a_disp').html(round2(start_col.a)+"±" + round2(start_col_var.a));
		$('#start_r_disp').html(round2(start_col.r)+"±" + round2(start_col_var.r));
		$('#start_g_disp').html(round2(start_col.g)+"±" + round2(start_col_var.g));		
		$('#start_b_disp').html(round2(start_col.b)+"±" + round2(start_col_var.b));		
		
		$('#start_size_pic').attr('width',emitter[p_slot].getStartSize());
		$('#start_size_pic').attr('height',emitter[p_slot].getStartSize());

		$('#start_size_disp').html(parseInt(emitter[p_slot].getStartSize())+"±"+parseInt(emitter[p_slot].getStartSizeVar()));		
		$('#startSize').val(emitter[p_slot].getStartSize());
		$('#startSizeVar').val(emitter[p_slot].getStartSizeVar());		
		
		$('#startSpin').val(emitter[p_slot].getStartSpin());
		$('#startSpinVar').val(emitter[p_slot].getStartSpinVar());
		$('#start_spin_disp').html(emitter[p_slot].getStartSpin()+"±"+emitter[p_slot].getStartSpinVar());	
		
		end_col=emitter[p_slot].getEndColor();
		$('#end_a').val(end_col.a);
		$('#end_r').val(end_col.r);		
		$('#end_g').val(end_col.g);
		$('#end_b').val(end_col.b);
		$("#end_color").css("background-color","rgba("+end_col.r*100+"%, "+end_col.g*100+"%, "+end_col.b*100+"%, "+round2(end_col.a)+")");
		$("#end_color").html($("#end_color").css("background-color"));		
		
		end_col_var=emitter[p_slot].getEndColorVar(); //c4f type  var.r var.g var.b var.a
		$('#end_a_var').val(end_col_var.a);
		$('#end_r_var').val(end_col_var.r);		
		$('#end_g_var').val(end_col_var.g);
		$('#end_b_var').val(end_col_var.b);

		$('#end_a_disp').html(round2(end_col.a)+"±" + round2(end_col_var.a));
		$('#end_r_disp').html(round2(end_col.r)+"±" + round2(end_col_var.r));
		$('#end_g_disp').html(round2(end_col.g)+"±" + round2(end_col_var.g));		
		$('#end_b_disp').html(round2(end_col.b)+"±" + round2(end_col_var.b));		
		
		$('#end_size_disp').html(parseInt(emitter[p_slot].getEndSize())+"±"+parseInt(emitter[p_slot].getEndSizeVar()));	
		$('#endSize').val(emitter[p_slot].getEndSize());
		$('#endSizeVar').val(emitter[p_slot].getEndSizeVar());

		$('#endSpin').val(emitter[p_slot].getEndSpin());
		$('#endSpin_var').val(emitter[p_slot].getEndSpinVar());
		$('#end_spin_disp').html(emitter[p_slot].getEndSpin()+"±"+emitter[p_slot].getEndSpinVar());		

		//gravity
		pos=emitter[p_slot].getPosition();
		posvar=emitter[p_slot].getPosVar();
		
		//$('#posx').val(pos.x);
		//$('#posy').val(pos.y);
		//$('#posx_var').val(posvar.x);
		//$('#posy_var').val(posvar.y);		
	
		$('#pos_var_x').val(posvar.x);
		$('#pos_var_x_text').val(posvar.x);
		$('#pos_var_y').val(posvar.y);
		$('#pos_var_y_text').val(posvar.y);
		$('#pos_var_disp').html(parseInt(posvar.x)+"x"+parseInt(posvar.y));
		
	    if (emitter[p_slot].getEmitterMode()==cc.PARTICLE_MODE_GRAVITY){ 

			$('#disp_angle').html(parseInt(emitter[p_slot].getAngle()));
			$('#disp_speed').html(parseInt(emitter[p_slot].getSpeed()));
 
			$('#speed').val(parseInt(emitter[p_slot].getSpeed()));
			$('#speed_text').val(parseInt(emitter[p_slot].getSpeed()));
			$('#speedVar').val(parseInt(emitter[p_slot].getSpeedVar()));
			$('#speedVar_text').val(parseInt(emitter[p_slot].getSpeedVar()));
			$('#speedVar_disp').html(emitter[p_slot].getSpeed()+"±"+emitter[p_slot].getSpeedVar());		

			grv=emitter[p_slot].getGravity();
			//$('#grav_x').val(grv.x);
			//$('#grav_y').val(grv.y);

			$('#gravity_x').val(grv.x);
			$('#gravity_x_text').val(grv.x);
			$('#gravity_y').val(grv.y);
			$('#gravity_y_text').val(grv.y);
			$('#gravity_disp').html(round1(grv.x)+"x"+round1(grv.y));
			
			$('#rad_accel').val(emitter[p_slot].getRadialAccel());
			$('#rad_accel_text').val(emitter[p_slot].getRadialAccel());
			$('#rad_accel_var').val(emitter[p_slot].getRadialAccelVar());		
			$('#rad_accel_var_text').val(emitter[p_slot].getRadialAccelVar());
			$('#rad_accel_disp').html(emitter[p_slot].getRadialAccel()+"±"+emitter[p_slot].getRadialAccelVar());

			$('#tan_accel').val(emitter[p_slot].getTangentialAccel());
			$('#tan_accel_text').val(emitter[p_slot].getTangentialAccel());
			$('#tan_accel_var').val(emitter[p_slot].getTangentialAccelVar());		
			$('#tan_accel_var_text').val(emitter[p_slot].getTangentialAccelVar());	
			$('#tan_accel_disp').html(emitter[p_slot].getTangentialAccel()+"±"+emitter[p_slot].getTangentialAccelVar());

		}else{

			//radius
			$('#maxRadius').val(emitter[p_slot].getStartRadius());		
			$('#maxRadiusVar').val(emitter[p_slot].getStartRadiusVar());		
			$('#minRadius').val(emitter[p_slot].getEndRadius());			
			$('#maxRadius_text').val(emitter[p_slot].getStartRadius());		
			$('#maxRadiusVar_text').val(emitter[p_slot].getStartRadiusVar());		
			$('#minRadius_text').val(emitter[p_slot].getEndRadius());	
	
			$('#rotatePerSecond').val(emitter[p_slot].getRotatePerSecond());		
			$('#rotatePerSecondVar').val(emitter[p_slot].getRotatePerSecondVar());	
			$('#rotatePerSecond_text').val(emitter[p_slot].getRotatePerSecond());		
			$('#rotatePerSecondVar_text').val(emitter[p_slot].getRotatePerSecondVar());	



			$('#max_radius_disp').html(emitter[p_slot].getStartRadius()+"±"+emitter[p_slot].getStartRadiusVar());			
			$('#min_radius_disp').html(emitter[p_slot].getEndRadius());			
			$('#rotate_par_second_disp').html(emitter[p_slot].getRotatePerSecond()+"±"+emitter[p_slot].getRotatePerSecondVar());	
		}	

		$('#maxParticles').val(emitter[p_slot].getTotalParticles());	
		$('#emissionRate').val(parseInt(emitter[p_slot].getEmissionRate()));	
		$('#emissionRate_text').val(parseInt(emitter[p_slot].getEmissionRate()));	
				
		//position
		pos=emitter[p_slot].getPosition();
		$('#emitter_posi').html(parseInt(pos.x)+" "+parseInt(pos.y));	
		
		$('#blend_normal').css('font-weight','normal');
		$('#blend_add').css('font-weight','normal');
		if (emitter[p_slot].isBlendAdditive()==true){
		  	$('#blend_add').css('font-weight','bold');    
		}else{
		  	$('#blend_normal').css('font-weight','bold');
		}		

		$('#type_grav').css('font-weight','normal');
		$('#type_rad').css('font-weight','normal');
	    if (emitter[p_slot].getEmitterMode()==cc.PARTICLE_MODE_GRAVITY){ 
		  	$('#type_grav').css('font-weight','bold');    
		  	drawAngle(p_slot,emitter[p_slot].getAngle(),emitter[p_slot].getSpeed());
			drawGrav(p_slot,emitter[p_slot].getGravity().x,emitter[p_slot].getGravity().y);
			drawEmitArea(p_slot,posvar.x,posvar.y);

		}else{
		  	$('#type_rad').css('font-weight','bold');
		}		

		$('#emit_rate_disp').html(round2(emitter[p_slot].getEmissionRate()));

		xml=baseXML2Plist(p_slot,true,'cocos',cc.Codec.Base64.decode( xml_base64 ));
		xmls[p_slot]=xml;
		xmlout=$('<div/>').text(xml).html();//htmlencode
		$("#plist").html(xmlout);

		plist_changed=parseInt((new Date)/1);
	
		if (!png_gz_b64[p_slot] || png_gz_b64[p_slot]=="undefined"){
			alert("no png_gz_b64["+p_slot+"] = " + png_gz_b64[p_slot]);
		}
		//xmlに出した画像をimgタグで表示してみる
		$("#img_check").attr("src","data:image/png;base64,"+base64encode( cc.Codec.GZip.gunzip(base64decode(png_gz_b64[p_slot]))));	
		
		//画像をセット
		if (!png_gz_b64[p_slot]) { 
			clog('no element '+ png_gz_b64[p_slot])
		}else{
			clog("element :length="+png_gz_b64[p_slot].length);
		}
		
		//$("img[id*=_pic]").attr("src","data:image/png;base64,"+base64encode( cc.Codec.GZip.gunzip(base64decode(png_gz_b64[p_slot]))));
		$('#grid_disp').html($('#grid').val());
}


function baseXML2Plist(p_slot,isPNG,p_type,baseStr){

	clog("baseXML2Plist:slot"+p_slot+" png:"+png_name[p_slot]);
	
	// p_type  cocos corona
	rev=1;
	if (p_type=='corona') rev= -1;
	
	
	l_xml=baseStr;   

	l_xml=l_xml.replace(/__angle__/m,    emitter[p_slot].getAngle() * rev);
	l_xml=l_xml.replace(/__angleVar__/m, emitter[p_slot].getAngleVar());

	l_xml=l_xml.replace(/__duration__/m, emitter[p_slot].getDuration());
	l_xml=l_xml.replace(/__life__/m,     emitter[p_slot].getLife());
	l_xml=l_xml.replace(/__lifeVar__/m,  emitter[p_slot].getLifeVar());

	//start
	start_col=emitter[p_slot].getStartColor(); //c4f type  var.r var.g var.b var.a
	
	l_xml=l_xml.replace(/__start_a__/m, round2(start_col.a));		
	l_xml=l_xml.replace(/__start_r__/m, round2(start_col.r));	
	l_xml=l_xml.replace(/__start_g__/m, round2(start_col.g));	
	l_xml=l_xml.replace(/__start_b__/m, round2(start_col.b));	
		
	start_col_var=emitter[p_slot].getStartColorVar(); //c4f type  var.r var.g var.b var.a
		
	l_xml=l_xml.replace(/__start_a_var__/m, round2(start_col_var.a));
	l_xml=l_xml.replace(/__start_r_var__/m, round2(start_col_var.r));	
	l_xml=l_xml.replace(/__start_g_var__/m, round2(start_col_var.g));	
	l_xml=l_xml.replace(/__start_b_var__/m, round2(start_col_var.b));	
	
	end_col=emitter[p_slot].getEndColor();
		
	l_xml=l_xml.replace(/__end_a__/m, round2(end_col.a));		
	l_xml=l_xml.replace(/__end_r__/m, round2(end_col.r));	
	l_xml=l_xml.replace(/__end_g__/m, round2(end_col.g));	
	l_xml=l_xml.replace(/__end_b__/m, round2(end_col.b));		

	end_col_var=emitter[p_slot].getEndColorVar(); //c4f type  var.r var.g var.b var.a	

	l_xml=l_xml.replace(/__end_a_var__/m, round2(end_col_var.a));		
	l_xml=l_xml.replace(/__end_r_var__/m, round2(end_col_var.r));	
	l_xml=l_xml.replace(/__end_g_var__/m, round2(end_col_var.g));	
	l_xml=l_xml.replace(/__end_b_var__/m, round2(end_col_var.b));

	l_xml=l_xml.replace(/__startSize__/m,    emitter[p_slot].getStartSize()  );
	l_xml=l_xml.replace(/__startSizeVar__/m, emitter[p_slot].getStartSizeVar());		
	l_xml=l_xml.replace(/__endSize__/m,      emitter[p_slot].getEndSize()    );
	l_xml=l_xml.replace(/__endSizeVar__/m,   emitter[p_slot].getEndSizeVar() );		
		
	l_xml=l_xml.replace(/__startSpin__/m,    emitter[p_slot].getStartSpin()  );
	l_xml=l_xml.replace(/__startSpinVar__/m, emitter[p_slot].getStartSpinVar());
	l_xml=l_xml.replace(/__endSpin__/m,      emitter[p_slot].getEndSpin()    );

	l_xml=l_xml.replace(/__emitterMode__/m, emitter[p_slot].getEmitterMode() );

	//gravity
	pos=emitter[p_slot].getPosition();
	posvar=emitter[p_slot].getPosVar();

	l_xml=l_xml.replace(/__posx__/m, pos.x);
	l_xml=l_xml.replace(/__posx_var__/m, posvar.x);
	l_xml=l_xml.replace(/__posy__/m, pos.y);
	l_xml=l_xml.replace(/__posy_var__/m, posvar.y);			

	if (emitter[p_slot].getEmitterMode()==cc.PARTICLE_MODE_GRAVITY){ 

		l_xml=l_xml.replace(/__speed__/m, emitter[p_slot].getSpeed());
		l_xml=l_xml.replace(/__speedVar__/m, emitter[p_slot].getSpeedVar());
		
		grv=emitter[p_slot].getGravity();
		l_xml=l_xml.replace(/__grav_x__/m, grv.x );
		l_xml=l_xml.replace(/__grav_y__/m, grv.y * rev);
	
		l_xml=l_xml.replace(/__rad_accel__/m, emitter[p_slot].getRadialAccel() );
		l_xml=l_xml.replace(/__rad_accel_var__/m, emitter[p_slot].getRadialAccelVar());
	
		l_xml=l_xml.replace(/__tan_accel__/m, emitter[p_slot].getTangentialAccel() * rev);
		l_xml=l_xml.replace(/__tan_accel_var__/m, emitter[p_slot].getTangentialAccelVar());
	}else{
		//radial
		l_xml=l_xml.replace(/__maxRadius__/m, emitter[p_slot].getStartRadius());	
		l_xml=l_xml.replace(/__maxRadiusVar__/m, emitter[p_slot].getStartRadiusVar());
		l_xml=l_xml.replace(/__minRadius__/m, emitter[p_slot].getEndRadius());
			
		l_xml=l_xml.replace(/__rotatePerSecond__/m, emitter[p_slot].getRotatePerSecond() * rev);	
		l_xml=l_xml.replace(/__rotatePerSecondVar__/m, emitter[p_slot].getRotatePerSecondVar());	
	}
	l_xml=l_xml.replace(/__maxParticles__/m, emitter[p_slot].getTotalParticles());		
	
	bl=emitter[p_slot].getBlendFunc();
	l_xml=l_xml.replace(/__blendFuncDestination__/m, bl.dst);		
	l_xml=l_xml.replace(/__blendFuncSource__/m, bl.src);
	
	if (isPNG){
		
		if (png_gz_b64[p_slot]=="undefined") alert("pnz_gz_b64["+ p_slot + "] undefined");
		l_xml=l_xml.replace(/__png_base64__/m, png_gz_b64[p_slot]);	//gzipしてbase64	
	}else{
		l_xml=l_xml.replace(/__png_base64__/m, "");	
	}

	l_xml=l_xml.replace(/__textureFileName__/m, $("#png_filename").val());
	l_xml=l_xml.replace(/__.*?__/mg, "0");	//gravity radius のセットしてないほう __****__ として残っている項目を全部0に
	
	return l_xml;
}


function refreshSlot(){

	//clog("refreshSlot slot:"+slot+" slot_bg:"+slot_bg);
	if (emitter.length==0) { slot=null; }

	//slotリンク作成
	this.str="";		
	
	this.str+= "<table><tr><td style='vertical-align:top;' >";
		//forground background
		if (slot_bg==-1 && bg_sprite) bg_str='<b style="color:#EEDDDD;" >BG</b>';
		else if (bg_sprite) bg_str='<span style="color:#EEDDDD;" >BG</span>';
		else bg_str='BG';
		
		this.str+='<a href="javascript:setBGSlot(-1);" id="slot_m1" style="font-size:130%" >'+bg_str+'</a> ';

		if (slot_bg==-2 && fg_sprite) fg_str='<b style="color:#EEDDDD;">FG</b>';
		else if (fg_sprite) fg_str='<span style="color:#EEDDDD;" >FG</span>';
		else fg_str='FG';

		this.str+='<a href="javascript:setBGSlot(-2);" id="slot_m2" style="font-size:130%" >'+fg_str+'</a> ';

		this.str+= "</td><td style='vertical-align:top;'>";

		//スロット
		for (ind in emitter){
		
			clog(" emitter "+ind+":"+emitter[ind].toString());
		
			ind=parseInt(ind);
			this.str+='<a href="javascript:setSlot('+ind+'); " id="slot_'+ind+'" style="font-size:130%" onMouseOver="checkSlot('+ind+');" onMouseOut="checkSlotOff('+ind+')" >Emit'+(ind+1)+'</a> ';
		}
		//offリンク
		this.str+='<a href="javascript:addSlot();" id="plusbutton" style="font-size:130%">＋</a> <br/>'
		for (ind in emitter){
			ind=parseInt(ind);
			this.str+='<a href="javascript:setSlotOff('+ind+');" id="slot_off_'+ind+'" style="place-hub:">Off'+(ind+1)+'</a> ';
		}
	
	this.str+="</td></tr></table>";

	$("#slots").html(this.str);

	//p_slotの強調
	$("a[id*=slot_]").css("color","#888888");
	$("a[id*=slot_]").css("font-weight","");
	
	//選択中エミッタが表示中なら太字、
	if (slot_bg == 0 ){
		clog("slot_bg=0");
		if ( emitter.length > 0 ){
			$("a[id=slot_"+slot+"]").css("font-weight","bold");
		}else{
			//選択中エミッタを決め直す
			for (ind in emitter){
				clog("new active sch");
				if (emitter[ind].isVisible()==true){
					$("a[id=slot_"+ind+"]").css("font-weight","bold");
					slot=ind;
					break;
				}
			}
		}
	}

	if (emitter.length==0){
		$("#current_slot").html("");
	}else{
		for (ind in emitter){
			if (emitter[ind].isVisible()==true){
				$("a[id=slot_"+ind+"]").css("color","");
			}
		}		
		$("#current_slot").html("Emit"+(parseInt(slot)+1));
	}
}

//エミッタをcocos2dxのものに変更、テクスチャはそのまま
function setEmitter(name,p_slot){

	clog("setEmitter name: "+name+" p_slot:"+p_slot );

	if (p_slot==null) { p_slot=slot=0; }

	if (emitter[p_slot]==undefined){
		//新規
		clog("new emitter:"+p_slot+" emitterCt:"+emitter.length);
		texture1=cc.TextureCache.getInstance().addImage("png/_s_fire.png");
		clog('setEmitter texture1=' + texture1);
		
		//画像をbase64にして保存
		png_gz_b64[p_slot]=png_gz_b64["_s_fire"];


		slot=p_slot;//今作ったものをアクティブに
		new_pos=cc.p(40 + (p_slot % 4) * 120 , 60 + Math.floor(p_slot / 4) * 200);
	}else{
		clog("replace emitter:"+p_slot +" emitterCt:"+emitter.length);
		texture1=emitter[p_slot].getTexture();
		emitter[p_slot].removeFromParent();
		new_pos=emitter[p_slot].getPosition();
		delete emitter[ind];
		emitter.splice(ind,1);	
	}

	//既存テクスチャ処理
	eval('emitter[p_slot] = cc.Particle'+name+'.create();');
	emitter[p_slot].setTexture(texture1);
		clog('setEmitter2 texture1=' + texture1);
	emitter[p_slot].setPosition(new_pos);
	layers=cc.Director.getInstance().getRunningScene().getChildren();
	layers[0].addChild(emitter[p_slot],5);

	setGuideObj(p_slot);
	dumpToInputTag(p_slot);
}

function toggleStats(){
	director=cc.Director.getInstance();
	if (director.isDisplayStats()){
		director.setDisplayStats(false);
	}else{
		director.setDisplayStats(true);
	}
}

function toggleGrid(){
	if (dn.isVisible()==true){
        dn.setVisible(false);
	}else{
        dn.setVisible(true);				
	}
}

var pre_filename="";
var prev_emitter;
var pre_index=""

function prevEnd(){

	if (prev_emitter){
		prev_emitter.removeFromParent(); 
		prev_emitter=null;
		delete prev_emitter;
	}
	prev_dn.setVisible(false);
	prev_string.setVisible(false);	
	
	pre_filename=""
	pre_index="99"
	
	return;	
}
function prevSnapshot(index){
	console.log('log ' + pre_index + ' ' + index);

	if (pre_index == index) return;
	
	console.log('prevSnapshot:' + index);
	prev_dn.setVisible(true);
	prev_string.setVisible(true);
	
	pre_index = index;
			
	particle_dict=xml2ary(snap[index]);
	if (!particle_dict) { alert("Plist fail"); return false; exit(); }

	//すでにemitterが存在していれば除去
	if (prev_emitter != undefined){
		if (prev_emitter.getParent()) {
			prev_emitter.removeFromParent(); 
			prev_emitter=null;
			delete prev_emitter;
		}
	}
	cc.TextureCache.getInstance().removeTextureForKey(particle_dict['textureFileName']);//この名前のテクスチャはキャッシュを消す
	prev_emitter= cc.ParticleSystem.create();

	//ここで
	//テクスチャデータがある場合
	if (particle_dict['textureImageData']){
		clog("textureImageData exist");	
		
		if (particle_dict['textureImageData']=="undefined") alert("textureImageData undefined");
		gzip_png=cc.Codec.Base64.decode(particle_dict['textureImageData']);
		//clog("png_gz_b64:"+p_slot+" "+ particle_dict['textureImageData'].length);
		png_gz_b64_prev=particle_dict['textureImageData'];
	}else{
		clog("no textureImageData");
		///デフォルトのtexture
		png_gz_b64_prev=png_gz_b64["_s_fire"];
		particle_dict['textureImageData']=png_gz_b64["_s_fire"];
	}

	prev_emitter.initWithDictionary(particle_dict,"");
	layers=cc.Director.getInstance().getRunningScene().getChildren();
	layers[0].addChild(prev_emitter,11);

}


function prevParticle(p_filename){

	if (pre_filename == p_filename) return;
	
	prev_string.setVisible(true);
	
	console.log('prevParticle:' + p_filename);
	prev_dn.setVisible(true);
	
	pre_filename = p_filename;
	$.ajax({
	   async:false,
	   type: "GET",
	   url: "plist/"+p_filename,
	   success:function(data){
			
			particle_dict=xml2ary(data);
			if (!particle_dict) { alert("Plist fail"); return false; exit(); }

			//すでにemitterが存在していれば除去
			if (prev_emitter != undefined){
				if (prev_emitter.getParent()) {
					prev_emitter.removeFromParent(); 
					prev_emitter=null;
					delete prev_emitter;
				}
			}
			cc.TextureCache.getInstance().removeTextureForKey(particle_dict['textureFileName']);//この名前のテクスチャはキャッシュを消す
			prev_emitter= cc.ParticleSystem.create();

			//ここで
			//テクスチャデータがある場合
			if (particle_dict['textureImageData']){
				clog("textureImageData exist");	
				
				if (particle_dict['textureImageData']=="undefined") alert("textureImageData undefined");
				gzip_png=cc.Codec.Base64.decode(particle_dict['textureImageData']);
				//clog("png_gz_b64:"+p_slot+" "+ particle_dict['textureImageData'].length);
				png_gz_b64_prev=particle_dict['textureImageData'];
			}else{
				clog("no textureImageData");
				///デフォルトのtexture
				png_gz_b64_prev=png_gz_b64["_s_fire"];
				particle_dict['textureImageData']=png_gz_b64["_s_fire"];
			}

			prev_emitter.initWithDictionary(particle_dict,"");
			layers=cc.Director.getInstance().getRunningScene().getChildren();
			layers[0].addChild(prev_emitter,11);
		}
	});		
}

//ajax取得
function getPlist(fname){
	$.ajax({
	   async:false,
	   type: "GET",
	   url: "plist/"+fname,
	   success:function(data){
			xmlStr2emitter(data,slot);
			}
		});	
}

function getP2dx(fname){
	$.ajax({
	   async:false,
	   type: "GET",
	   url: "plist/"+fname,
	   success:function(data){
			decodeP2DX(data);
			}
		});	
}

//XML文書をjsのaryに
function xml2ary(xml_str){

    var xmlDoc = null;
   
    if ( typeof(xml_str) == "object" ) { // If xml_str is object then use directly
        xmlDoc = xml_str;
    } else {                             // Otherwise parse str
        var parser = new DOMParser();
        xmlDoc = parser.parseFromString(xml_str, "text/xml");   
    }
	var plist = xmlDoc.documentElement;
	// Get first real node
    var node = null;
    for (var i = 0, len = plist.childNodes.length; i < len; i++) {
        node = plist.childNodes[i];
        if (node.nodeType == 1)
            break
    }
    xmlDoc = null;
	return cc.SAXParser.getInstance()._parseNode(node);	//xmlを配列に
}


//cocos2dxのplist > emitter 
function xmlStr2emitter(p_xml,p_slot){

	clog("xmlStr2emitter p_slot:" + p_slot);

	if (p_slot==null) { 
		slot=p_slot=0;
		clog("p_slot is NULL and override p_slot:" + p_slot);	
	}
	particle_dict=xml2ary(p_xml);
	if (!particle_dict) { alert("Plist fail"); return false; exit(); }
	
	//すでにemitterが存在していれば除去
	if (emitter[p_slot]!=undefined){
		if (emitter[p_slot].getParent()) {
			emitter[p_slot].removeFromParent(); 
			emitter[p_slot]=null;
			delete emitter[p_slot];
			clog(" emitter:"+p_slot+" setNULL");
		}
	}
	
	cc.TextureCache.getInstance().removeTextureForKey(particle_dict['textureFileName']);//この名前のテクスチャはキャッシュを消す
	emitter[p_slot] = cc.ParticleSystem.create();
	clog("emitter:"+p_slot+" create");
	
	//ここで
	//テクスチャデータがある場合
	if (particle_dict['textureImageData']){
		clog("textureImageData exist");	
		
		if (particle_dict['textureImageData']=="undefined") alert("textureImageData undefined");
		gzip_png=cc.Codec.Base64.decode(particle_dict['textureImageData']);
		//clog("png_gz_b64:"+p_slot+" "+ particle_dict['textureImageData'].length);
		png_gz_b64[p_slot]=particle_dict['textureImageData'];
		clog("slot:"+slot);
	}else{
		clog("no textureImageData");
		///デフォルトのtexture
		png_gz_b64[p_slot]=png_gz_b64["_s_fire"];
		particle_dict['textureImageData']=png_gz_b64["_s_fire"];
	}
	
	emitter[p_slot].initWithDictionary(particle_dict,"");
	layers=cc.Director.getInstance().getRunningScene().getChildren();
	layers[0].addChild(emitter[p_slot],5);
	texture1=emitter[p_slot].getTexture();
	
	if (emitter[p_slot].getEmitterMode()==cc.PARTICLE_MODE_GRAVITY){
		toggleGravityRadius("gravity",p_slot);
	}else{
		toggleGravityRadius("radius",p_slot);
	}
	
	prev_dn.setVisible(false);
	prev_string.setVisible(false);
	current_start_color=emitter[slot].getStartColor();	
}

//すべてのスロットとsnapshotをjsonに
function encodeP2DX(){

	//xmlsのプログラムをセットする。
	for (ind in emitter){
		dumpToInputTag(ind);
	}
	return xmls;
}

function decodeP2DX(p2dx_JSON){

	clog("decodeP2DX");

	//画面上のemitter 全削除
	for(ind in emitter){
		emitter[ind].removeFromParent();
		emitter[ind]=null;
		delete emitter[ind];
		clog( " emitter:"+ind+" setNULL");
	}
	emitter=[];

	json=JSON.parse(p2dx_JSON);
	clog("decodeP2DX emitters:"+json.length);
	
	for (ind in json){
		clog("emit "+ind + "xml"+json[ind]);
		slot=ind;
		xmlStr2emitter(json[ind],ind);
	}
}

function getSnapshot(){
	snap[snap.length]=xml; 
	$("#snapshots").html($("#snapshots").html()+"&nbsp;<a href='"+'javascript:xmlStr2emitter(snap['+(snap.length-1)+'],slot)' + "' " + 'onMouseOver="prevSnapshot('+(snap.length-1)+');" onMouseOut="prevEnd(); "' + '>s' + (snap.length-1) + "</a> ");
	
}
function clrSnapshot(){
	snap=[];
	$("#snapshots").html(" ");
}

// slot関連 ---------------------------------------

function rotateSlot(p_slot,digree){
	
	rad= Math.PI /180 * digree;
	
	emitter[p_slot].setAngle(emitter[p_slot].getAngle() +digree);
	
	g = emitter[p_slot].getGravity();
	emitter[p_slot].setGravity(cc.p( round2(g.x * Math.cos(rad) - g.y * Math.sin(rad)) ,round2( g.x * Math.sin(rad) + g.y * Math.cos(rad) )));
	
	dumpToInputTag(p_slot);
}

function changeEmitterSize(p_slot , bairitu){
	
	clog("changeEmitterSize slot:"+p_slot + " bairitu:"+bairitu );
	
	emitter[p_slot].setSpeed(    Math.floor(emitter[p_slot].getSpeed()*bairitu) );
	emitter[p_slot].setSpeedVar( Math.floor(emitter[p_slot].getSpeedVar()*bairitu) );

	g=emitter[p_slot].getGravity();
	emitter[p_slot].setGravity( cc.p(  Math.floor(g.x*bairitu), Math.floor(g.y*bairitu)  ) );

	pv=emitter[p_slot].getPosVar();
	emitter[p_slot].setPosVar( cc.p(  Math.floor(pv.x * bairitu), Math.floor(pv.y * bairitu)  ) );

	emitter[p_slot].setStartSize( Math.floor(emitter[p_slot].getStartSize() * bairitu));
	emitter[p_slot].setEndSize  ( Math.floor(emitter[p_slot].getEndSize()   * bairitu));
	
	dumpToInputTag(p_slot);
}


function size4Slot(base_num){

	incl=0;
	for (i=1;i<=4;i++){
		 
		incl++;
		ind2 = emitter.length;
		xmlStr2emitter(xmls[base_num],ind2);
		bairitu=(1+ i*0.4);
		emitter[ind2].setPosition(emitter[base_num].getPositionX() , emitter[base_num].getPositionY() + i * 140 );
		
		changeEmitterSize(ind2,bairitu);
	}
}
function speed4Slot(base_num){

	incl=0;
	for (i=1;i<=6;i++){
		 
		incl++;
		ind = emitter.length;
		xmlStr2emitter(xmls[base_num],ind);
		emitter[ind].setPosition(emitter[base_num].getPositionX() ,
								 emitter[base_num].getPositionY() + i * 70 );
		
		emitter[ind].setSpeed( emitter[base_num].getSpeed()*(1+ i*0.2) );
		emitter[ind].setSpeedVar( emitter[base_num].getSpeedVar()*(1+ i* 0.2) );


		incl++;
		ind = emitter.length;
		xmlStr2emitter(xmls[base_num],ind);
		emitter[ind].setPosition(emitter[base_num].getPositionX() ,
								 emitter[base_num].getPositionY() - i * 70);
		
		emitter[ind].setSpeed( emitter[base_num].getSpeed()*(1- i*0.1) );
		emitter[ind].setSpeedVar( emitter[base_num].getSpeedVar()*(1- i* 0.1) );
	}
}

//emitterを8種類追加。
function color9Slot(base_num){
	
	incl=0;
	for (i=0;i<=2;i++){
		for (j=0;j<=2;j++){	
			for (k=0;k<=2;k++){	
				if (i==j==k ) { continue;}
				incl++;
				clog(i+" "+j+" "+k);
				ind = emitter.length;
				xmlStr2emitter(xmls[base_num],ind);
				emitter[ind].setPosition(emitter[base_num].getPositionX() + Math.floor(incl/10) * 300,
										 emitter[base_num].getPositionY() + (incl%10) * 70 );
				
				s_col_c4d=emitter[base_num].getStartColor();
				col=[];
				col[0]=s_col_c4d.r;
				col[1]=s_col_c4d.g;				
				col[2]=s_col_c4d.b;
				
				emitter[ind].setStartColor(cc.c4f(col[i],col[j],col[k],1));
			}				
		}		
	}
}

function muteAllSlot(){
	if (emitter.length==0){ return ;}
	for (ind in emitter) { emitter[ind].setVisible(false); }
	refreshSlot();
}

function setSlotOff(p_num){
	clog("setSlotOff:"+p_num);
	emitter[p_num].setVisible(false);
	dumpToInputTag(p_num);
}



function setSlot(p_num){
	clog("setSlot:"+p_num);
	
	if (!emitter[p_num]){
		clog("emitter has no element:"+p_num);
		return false;
	}
	
	emitter[p_num].setVisible(true);
	slot=p_num;
	slot_bg=0;	
	dumpToInputTag(p_num);
}


function toggleSlot(p_num){
	clog("setSlot:"+p_num);
	
	if (!emitter[p_num]){
		clog("emitter has no element:"+p_num);
		return false;
	}
	
	if (emitter[p_num].isVisible()){
		emitter[p_num].setVisible(false);
	}else{
		emitter[p_num].setVisible(true);
	}
	slot=p_num;
	dumpToInputTag();
}

function toggleDebug(){
	if (cc.IS_SHOW_DEBUG_ON_PAGE == true) {
		cc.IS_SHOW_DEBUG_ON_PAGE=false;
		$("#logInfoDiv").hide();
	}else{
		cc.IS_SHOW_DEBUG_ON_PAGE=true;
		$("#logInfoDiv").show();
	}
}

function checkSlot(p_num){
	//出現範囲の四角形を表示
	guiderect[p_num].setVisible(true);
}

function checkSlotOff(p_num){
	guiderect[p_num].setVisible(false);
}

function addSlot(){
	setEmitter("Fire",emitter.length);
}

function removeSlot(p_slot){

	if (emitter.length==0) {return false;}

	emitter[p_slot].removeFromParent();
	delete emitter[p_slot];
	emitter.splice(p_slot,1);
	slot=0;
	refreshSlot();
	dumpToInputTag();
}

function removeOtherSlot(p_slot){

	clog("removeOtherSlot"+p_slot);
	if (emitter.length==0) {return false;}

	for (i=emitter.length-1;i>=0;i--){
		if (i==p_slot) { continue; }
		clog(i);
		emitter[i].removeFromParent();		
		delete emitter[i];
		emitter.splice(i,1);
	}
	slot=0;
	refreshSlot();
	dumpToInputTag();
}

function pickUpSlot(p_slot){
	
}

//加工しやすい初期状態に戻す
function setMoveInit(){
	emitter[slot].setSpeed(50);
	emitter[slot].setSpeedVar(0);	
		
	emitter[slot].setAngle(90);
	emitter[slot].setAngleVar(10);
	
	emitter[slot].setLifeVar(1);
	
	emitter[slot].setPosVar(cc.p(0,0));	
		
	emitter[slot].setStartSpin(0);		
	emitter[slot].setEndSpin(0);

	emitter[slot].setGravity(cc.p(0,0));
		
	emitter[slot].setTangentialAccel(0);		
}

function setColorInit(){

	//emitter[slot].setStartColor( cc.c4f(1,0.5,0.4,1));
	emitter[slot].setEndColor(   cc.c4f(1,0.5,0.4,1));	
	emitter[slot].setStartColorVar( cc.c4f(0,0,0,0));
	emitter[slot].setEndColorVar(   cc.c4f(0,0,0,0));	
}

var base64list = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

function base64encode(s)
{
  if (s=="undefined") alert("base64encode length 0 ");
  clog("base64encode length:"+ s.length);

  var t = '', p = -6, a = 0, i = 0, v = 0, c;

  while ( (i < s.length) || (p > -6) ) {
    if ( p < 0 ) {
      if ( i < s.length ) {
        c = s.charCodeAt(i++);
        v += 8;
      } else {
        c = 0;
      }
      a = ((a&255)<<8)|(c&255);
      p += 8;
    }
    t += base64list.charAt( ( v > 0 )? (a>>p)&63 : 64 )
    p -= 6;
    v -= 6;
  }
  return t;
}



function base64decode(s)
{
  if (s=="undefined") alert("base64decode length 0 ");
  clog("base64decode length:"+ s.length);

  var t = '', p = -8, a = 0, c, d;

  for( var i = 0; i < s.length; i++ ) {
    if ( ( c = base64list.indexOf(s.charAt(i)) ) < 0 )
      continue;
    a = (a<<6)|(c&63);
    if ( ( p += 6 ) >= 0 ) {
      d = (a>>p)&255;
      if ( c != 64 )
        t += String.fromCharCode(d);
      a &= 63;
      p -= 8;
    }
  }
  return t;
}

function keyShortCut(keycode){


  clog("keyShortCut:"+keycode);


  // 38 40 up down  
  if (keycode == 38){ changeEmitterSize(slot , 1.2); }
  if (keycode == 40){ changeEmitterSize(slot , 0.8); }  

  // r:82 rotate     37 39  left right 
  //if (keycode == 82){ rotateSlot(slot,-10); return false;}
  if (keycode == 37){ rotateSlot(slot,10); }
  if (keycode == 39){ rotateSlot(slot,-10); }

  //73 

  //g:71 gravity   r:82 radius 
  if (keycode == 71) { toggleGravityRadius("gravity",slot); } 
  if (keycode == 82) { toggleGravityRadius("radius",slot); } 

  if (keycode == 48){ muteAllSlot(); }  //zero
  if (49 <= keycode && keycode <= 57 ){    toggleSlot(keycode-49);  }


  // s:83 stats   g:71 grid
  //  if (keycode == 83){ toggleStats(); }
  // if (keycode == 71){ toggleGrid(); }  

  // i:73 import pane toggle
  if ( keycode == 66 ){ toggleTopleftPane('background'); }  
  if ( keycode == 84 ){ toggleTopleftPane('template'); }
  if ( keycode == 73 ){ toggleTopleftPane('import'); }
  // changePane  t:84 template m:77 motion
  if (keycode == 77){ toggleTopleftPane('motion'); }
  if (keycode == 67){ toggleTopleftPane('shape'); }//  c:67 color pane   s:83 shapes


  if (keycode == 68){ duplicateSlot(slot); }// d:68 duplicate

  if (keycode == 83){ getSnapshot(); }// s:83 snapshot

  //p:80 plistDL   
  if (keycode == 80){ 
					  document.form_post_dl.type.value="plist_xml";
  					  document.form_post_dl.plist_xml.value=encodeURIComponent(xml);
                      document.form_post_dl.submit(); }

  // minus 189:remove
  if (keycode == 189){ removeSlot(slot); }
  // a:65 addSlot
  if (keycode == 65){ addSlot(); }  
}

function togglePane(pane_name){ $('#pane_'+pane_name).slideToggle(100); }

$(window).keydown(function(e){
    clog("keydown:"+e.keyCode+" ctrl: "+e.ctrlKey + " shift:"+e.shiftKey +" alt:"+e.altKey);//  KEYCODE  Com:91 Shift:16  Esc:27  Delete:8  Tab:9 Enter:13 Option:18  Spc:32 
    if (e.altKey) keyShortCut(e.keyCode);
    if (37 <= e.keyCode && e.keyCode <= 40 ) { return false; }
    return true;
});

function setGuideRect(p_slot){

	if (guiderect[p_slot]){
		guiderect[p_slot].removeFromParent();
		guiderect[p_slot]=null;
		delete guiderect[p_slot];
	}

	//ガイド四角形
	guiderect[p_slot]=cc.Sprite.create("res/rect100.png");
	guiderect[p_slot].setOpacity(100); 
	emitter[p_slot].addChild(guiderect[p_slot],6);
	guiderect[p_slot].setVisible(false);
}

function setGuideCircle(p_slot){
	
	if (guiderect[p_slot]){
		guiderect[p_slot].removeFromParent();
		guiderect[p_slot]=null;
		delete guiderect[p_slot];
	}

	layers=cc.Director.getInstance().getRunningScene().getChildren();
	
	clog("setGuideCircle p_slot:"+p_slot);
	guiderect[p_slot]=cc.DrawNode.create();
	//guiderect[p_slot].setPosition(emitter[slot].getPosition());
	
	//開始範囲
	guiderect[p_slot].drawDot(cc.p(0,0), emitter[p_slot].getStartRadius()+ emitter[p_slot].getStartRadiusVar() , cc.c4f(0.5,0.5,0.5, 0.3 ));//centerPos hankei color4F
	guiderect[p_slot].drawDot(cc.p(0,0), emitter[p_slot].getStartRadius()- emitter[p_slot].getStartRadiusVar() , cc.c4f(0.5,0.5,0.5, 0.3 ));//centerPos hankei color4F	

	 //終了点
	 guiderect[p_slot].drawDot(cc.p(0,0), emitter[p_slot].getEndRadius()   , cc.c4f(0.5,0.5,0.5, 0.3 ));//centerPos hankei color4F

	 //angle line
	 hankei=emitter[p_slot].getStartRadius()+ emitter[p_slot].getStartRadiusVar();
	 rad_angle= (emitter[p_slot].getAngle() + 30) * Math.PI / 180;
	 c_size=guiderect[p_slot].getContentSize();
	 ppp=cc.p(c_size.width/2 + (Math.cos(rad_angle)-Math.sin(rad_angle)) * hankei , 
	 		  c_size.height/2 + (Math.sin(rad_angle) + Math.cos(rad_angle)) * hankei );

	// guiderect[p_slot].drawPoly([cc.p(c_size.width/2,c_size.height/2),ppp,cc.p(c_size.width/2+1,c_size.height/2+1)] , cc.c4f(0.9,0.9,0.9, 0.8 ), 2, cc.c4f(0.9,0.9,0.9, 0.8 ));

	emitter[p_slot].addChild(guiderect[p_slot],6);
}

function delBGImage(){
	if (bg_sprite){
		bg_sprite.removeFromParent();
		bg_sprite=null;
		delete bg_sprite;
	}		
}

//gravityか
function toggleGravityRadius(pane_name,p_slot){
	
	clog("toggleGravityRadius param:"+pane_name);
	
	if (pane_name=="gravity"){
		emitter[p_slot].setEmitterMode(cc.PARTICLE_MODE_GRAVITY); 
		setGuideObj(p_slot);
		$('#pane_gravity').slideDown(100);
		$('#pane_radius').slideUp(100);
	}else{
		emitter[p_slot].setEmitterMode(cc.PARTICLE_MODE_RADIUS);  
		setGuideObj(p_slot);	
		$('#pane_gravity').slideUp(100);
		$('#pane_radius').slideDown(100);
	}
	guiderect[p_slot].setVisible(false);
	dumpToInputTag(p_slot); 	
}

function setGuideObj(p_slot){

	if (emitter[p_slot].getEmitterMode()==cc.PARTICLE_MODE_GRAVITY){
		setGuideRect(p_slot);
	}else{
		setGuideCircle(p_slot);	
	}
}

function downloadPng(p_slot){

	if (!png_gz_b64[p_slot]) { 
		clog('no png '+ png_gz_b64[p_slot])
	}else{
		clog("png :length="+png_gz_b64[p_slot].length);
		document.form_post_dl.type.value="png_dl64gz";
		document.form_post_dl.png_dl64gz.value=encodeURIComponent(png_gz_b64[p_slot]);
		document.form_post_dl.submit();
	}
}

function downloadPlistNoImg(p_slot){

	document.form_post_dl.type.value="cocos_plist_dl";
	document.form_post_dl.plist_xml.value=encodeURIComponent(baseXML2Plist(p_slot,false,'cocos',cc.Codec.Base64.decode( xml_base64 )));
	document.form_post_dl.submit();	
}

function downloadJsonNoImg(p_slot){

	document.form_post_dl.type.value="corona_json_dl";
	document.form_post_dl.plist_xml.value=encodeURIComponent(baseXML2Plist(p_slot,false,'corona',corona_base_json));
	document.form_post_dl.submit();
}

function duplicateSlot(p_slot){
	current_xml=xmls[p_slot];
  	p=emitter[p_slot].getPosition();
  	addSlot();
  	xmlStr2emitter(current_xml,emitter.length-1)
  	emitter[emitter.length-1].setPosition(cc.p(p.x+100,p.y+100));	
}

