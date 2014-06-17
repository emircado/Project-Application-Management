<div class="primary">
    <div class="primary-container">
        <div class="primary-content">
            <div id="table" class="module-table module brand-names-table">
                <div class="header-block">
                    <div class="header-block-content">
                        <div class="header-block-title">
                            <h2 id="app-main-title" class="content-title">Applications</h2><hr>
                        </div>
                        <input type="hidden" id="app-main-csrf" value="<?php echo Yii::app()->request->csrfToken ?>" />
                        <?php 
                            //RENDER VIEWS
                            $this->renderPartial('//applications/applications-main-list');
                            $this->renderPartial('//applications/applications-main-create');
                            $this->renderPartial('//applications/applications-main-view');
                            $this->renderPartial('//applications/applications-main-edit');
                        ?>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>