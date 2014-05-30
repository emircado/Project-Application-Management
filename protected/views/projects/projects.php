<div class="primary">
    <div class="primary-container">
        <div class="primary-content">
            <div id="table" class="module-table module brand-names-table">
                <div class="header-block">
                    <div class="header-block-content">
                        <div class="header-block-title">
                            <h2 id="projects-title" class="content-title">Projects</h2><hr>
                        </div> 
                        <input type="hidden" id="projects-csrf" value="<?php echo Yii::app()->request->csrfToken ?>" />
                        <?php 
                            //RENDER VIEWS
                        	$this->renderPartial('//projects/projects-list');
                            $this->renderPartial('//projects/projects-create');
                            $this->renderPartial('//projects/projects-edit');
                            $this->renderPartial('//projects/projects-view'); 
                        ?>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>