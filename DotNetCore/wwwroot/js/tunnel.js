$(function () {

    var resizeEnd;
    $(window).on('resize', function () {
        clearTimeout(resizeEnd);
        resizeEnd = setTimeout(function () {
            $(window).trigger('resize-end');
        }, 250);
    });

    $(window).on('resize-end', function () {
        init(true);
    });

    function init(resize) {

        var wh = $('#scenecontainer').height(),
            ww = $('#scenecontainer').width()

	    /* WEBGL RENDERER */
        if (resize) {
            renderer.setSize(ww, wh);
            return;
        }

        renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('scene') });
	    renderer.setSize(ww,wh);

	    scene = new THREE.Scene();

	    camera = new THREE.PerspectiveCamera(50, ww/wh, 1, 10000 );
	    scene.add(camera);


	    light = new THREE.PointLight(0xffffff, 1, 1300);
	    light.position.set( 0, 0, -750 );
	    scene.add(light);

	    createBox();

	    animate();

    };

    function createBox(){
	
	    elements = new THREE.Object3D();

	    var colors = [
		    new THREE.Color( 0x2cc6e5 ),
		    new THREE.Color( 0x91f4f4 ),
		    new THREE.Color( 0xe6a09e ),
		    new THREE.Color( 0x1071ac )
	    ];

	    var geometry = new THREE.BoxGeometry(50,50,150);
	    var translate = new THREE.Matrix4().makeTranslation(150,0,0);

	    for(var i=0;i<14;i++){
		    var circle = new THREE.Object3D();
		    for(var j=0;j<13;j++){
			    var material = new THREE.MeshLambertMaterial({color: colors[i%4]});
			    var cube = new THREE.Mesh(geometry, material);
			    var rotation =  new THREE.Matrix4().makeRotationZ(Math.PI*2/13*j);
			    cube.applyMatrix( new THREE.Matrix4().multiplyMatrices(rotation, translate) );
			    circle.add(cube);
		    }
		    circle.position.z = -i*180;
		    elements.add(circle);
	    }
	    farest = -13*180;
	    scene.add(elements);

	    renderer.render(scene, camera);

    };

    var counter = 0;
    var animate = function () {
	    requestAnimationFrame(animate);

	    for(var i=0;i<14;i++){
		    var circle = elements.children[i];
		    if(camera.position.z <= circle.position.z){
			    farest-=180;
			    circle.position.z = farest;
		    }
	    }
	    camera.rotation.z += .005;
	    camera.position.z -= 7;
	    light.position.z -= 7;
	    light.position.y = Math.sin(counter/50)*75;
	    light.position.x = Math.cos(counter/50)*75;
	    counter++;

	    renderer.render(scene, camera);
    };

    init();

});

