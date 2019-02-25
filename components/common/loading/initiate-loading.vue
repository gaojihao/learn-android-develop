<template>
	<div v-show="visible" class="spinner-container" :style="styleObject">
        <div class="wrapper">
            <div class="spinner"><div class="double-bounce1"></div><div class="double-bounce2"></div></div>
        </div>
	</div>
</template>

<script>
    export default {
        props: {
        },
    	data(){
            return{
                visible: true,
                styleObject: {}
            }
        },
        mounted(){
        },
    }
</script>

<style >
	.spinner-container {
		display: block;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: #fff;
	}

	.spinner-container  > .wrapper {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		-webkit-transform: translate(-50%, -50%);
	}

    .spinner {
        width: 40px;
        height: 40px;
        margin: 100px auto;
        background-color: #dbe1ec;
        border-radius: 100%;
        -webkit-animation: spinner-scaleout 1.0s infinite ease-in-out;
        animation: spinner-scaleout 1.0s infinite ease-in-out;
    }

    @-webkit-keyframes spinner-scaleout {
        0% {
            -webkit-transform: scale(0)
        }

        100% {
            -webkit-transform: scale(1.0);
            opacity: 0;
        }
    }

    @keyframes spinner-scaleout {
        0% {
            -webkit-transform: scale(0);
            transform: scale(0);
        }

        100% {
            -webkit-transform: scale(1.0);
            transform: scale(1.0);
            opacity: 0;
        }
    }
</style>
