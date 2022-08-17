<template>
    <div class="container">
        <div class="row">
            <div
                class="col-md-12 d-flex justify-content-center align-items-center"
            >
                <div class="error-template text-center">
                    <img
                        src="@/assets/error.png"
                        width="250"
                        alt="img-notfound"
                    />
                    <h1>Sorry!</h1>
                    <h2>The page can’t be found.</h2>
                    <div class="error-details" style="width: 320px">
                        The page you're looking for isn't available. Try with
                        another page or use the go home button below
                    </div>
                    <div class="error-actions my-4">
                        <a href="/" class="btn btn-primary"
                            ><span class="glyphicon glyphicon-home"></span> Back
                            To Home
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped></style>
