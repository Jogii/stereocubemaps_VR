// Add stereo components
// based on https://github.com/oscarmarinmiro/aframe-stereo-component/blob/master/index.js

  AFRAME.registerComponent('stereocam', {
    schema: {
      eye: { type: 'string', default: "left"}
    },

    init: function(){
      this.layer_changed = false;
    },

    tick: function(time){
      var originalData = this.data;
      if(!this.layer_changed){
        var childrenTypes = [];
        this.el.object3D.children.forEach( function(item, index, array) {
          childrenTypes[index] = item.type;
        });
        var rootIndex = childrenTypes.indexOf("PerspectiveCamera");
        var rootCam = this.el.object3D.children[rootIndex];
        rootCam.layers.enable(originalData.eye === 'left' ? 1:2);
      }
    }
  });


// Add sky (stereo cubemap support)

  AFRAME.registerComponent('skycube', {

    schema: {
      folder: { type: "string" },
      eye: { type: 'string', default: "left"}
    },

    // update: function() {
      // var loader = new THREE.CubeTextureLoader();
      // var urls = [ "L-2.jpg","L-0.jpg","L-5.jpg","L-4.jpg","L-1.jpg","L-3.jpg"];
      // var materialArray = [];
      // for (var i = 0; i < 6; i++) {
        // materialArray.push( new THREE.MeshBasicMaterial({
          // map: (new THREE.TextureLoader).load( this.data.folder+"/" + urls[i] ),
          // depthWrite: false
        // }));
      // }
      // var material = new THREE.MeshFaceMaterial(materialArray);
      // var skyboxGeometry = new THREE.BoxGeometry(1000,1000,1000);
     // //skyboxGeometry.applyMatrix( new THREE.Matrix4().makeScale( 1, 1, -1 ) );
      // var mesh = new THREE.Mesh(skyboxGeometry,material);
      // mesh.layers.set( this.data.eye === 'left' ? 1:2 );
      // this.el.setObject3D('mesh', mesh);
      // this.materials = material;
    // }
	
	update: function() {
      var loader = new THREE.CubeTextureLoader();
      var skyboxGeometry = new THREE.BoxGeometry(1000,1000,1000);
	  var textures = this.getTexturesFromAtlasFile( "Cubemaps/Construct_ImminentCollision_cubemap.jpg", 12 );
	  var materialArray = [];
	  for ( var i = 0; i < 12; i ++ ) {

				materialArray.push( new THREE.MeshBasicMaterial( { map: textures[ i ] } ) );

			}
      var mesh = new THREE.Mesh(skyboxGeometry,materialArray);
      mesh.layers.set( this.data.eye === 'left' ? 1:2 );
      this.el.setObject3D('mesh', mesh);
      this.materials = materialArray;
    },
	
	getTexturesFromAtlasFile: function( atlasImgUrl, tilesNum ) {

			var textures = [];

			for ( var i = 0; i < tilesNum; i ++ ) {

				textures[ i ] = new THREE.Texture();

			}

			var imageObj = new Image();

			imageObj.onload = function() {

				var canvas, context;
				var tileWidth = imageObj.height;

				for ( var i = 0; i < textures.length; i ++ ) {

					canvas = document.createElement( 'canvas' );
					context = canvas.getContext( '2d' );
					canvas.height = tileWidth;
					canvas.width = tileWidth;
					context.drawImage( imageObj, tileWidth * i, 0, tileWidth, tileWidth, 0, 0, tileWidth, tileWidth );
					textures[ i ].image = canvas
					textures[ i ].needsUpdate = true;

				}

			};

			imageObj.src = atlasImgUrl;

			return textures;

		}
  });
