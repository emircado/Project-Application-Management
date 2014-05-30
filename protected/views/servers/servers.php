<div class="primary">
    <div class="primary-container">
        <div class="primary-content">
            <div id="table" class="module-table module brand-names-table">
                <div class="header-block">
                    <div class="header-block-content">
                        <div class="header-block-title">
                            <h2 class="content-title">Servers</h2><hr>
                        </div>
                        <input type="hidden" id="servers-csrf" value="<?php echo Yii::app()->request->csrfToken ?>" />
                        <?php 
                            //RENDER VIEWS
                            $this->renderPartial('//servers/servers-list');
                            $this->renderPartial('//servers/servers-create');
                            $this->renderPartial('//servers/servers-edit');
                            $this->renderPartial('//servers/servers-view'); 
                        ?>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>