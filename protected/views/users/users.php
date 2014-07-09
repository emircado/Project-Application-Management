<div class="primary">
    <div class="primary-container">
        <div class="primary-content">
            <div id="table" class="module-table module brand-names-table">
                <div class="header-block">
                    <div class="header-block-content">
                        <div class="header-block-title">
                            <h2 id="users-title" class="content-title">Users</h2>
                            <div class="form-note"><i id="users-note">Point persons of applications.</i></div>
                            <hr>
                        </div> 
                        <input type="hidden" id="users-csrf" value="<?php echo Yii::app()->request->csrfToken ?>" />
                        <?php 
                            //RENDER VIEWS
                            $this->renderPartial('//users/users-list');
                            $this->renderPartial('//applications/applications-main-view'); 
                            $this->renderPartial('//applications/applications-main-edit');
                        ?>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>