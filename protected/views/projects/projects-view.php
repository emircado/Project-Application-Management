<!-- view part view -->
<div id="projects-view" style="display:none;" class="contact-info plain-list">
    <div class="header-block-button" style="margin:0px;">
        <div class="pseudo-field back-button">
            <a id="projects-view-back-button" href="#" title="Back to main" class="with-tool-tip"><span class="icon"></span><span class="tooltip">Back<span class="arrow icon"></span></span></a>
        </div>
    </div><br /><br />

    <div id="details-projects-view">
        <!-- CONTENT HERE -->
        <form>
            <input type="hidden" id="projects-view-csrf" value="<?php echo Yii::app()->request->csrfToken ?>" />
            <div class="contact-info-details">
                <div class="section primary-info expanded">
                    <div id="expand-primary" class="header">
                        <h3><b>Project Details</b></h3>&nbsp&nbsp
                        <a id="projects-view-edit-button" href="#">[Edit]</a>
                    </div>
                </div>
                <div id="edit-primary-content" class="content">
                    <div class="field field-input-name">
                        <div class="field-secondary"><span class="label">ID</span></div>
                        <div class="field-primary">
                            <div class="pseudo-field no-border">
                                <span class="value" id="projects-view-id"></span>
                            </div>
                        </div><!-- End Field Primary -->
                    </div><!-- End Field -->                
                    <div class="field field-input-name">
                        <div class="field-secondary"><span class="label">Name</span></div>
                        <div class="field-primary">
                            <div class="pseudo-field no-border">
                                <span class="value" id="projects-view-name"></span>
                            </div>
                        </div><!-- End Field Primary -->
                    </div><!-- End Field -->
                    <div class="field field-input-name">
                        <div class="field-secondary"><span class="label">Code</span></div>
                        <div class="field-primary">
                            <div class="pseudo-field no-border">
                                <span class="value" id="projects-view-code"></span>
                            </div>
                        </div><!-- End Field Primary -->
                    </div><!-- End Field --> 
                    <div class="field field-input-name">
                        <div class="field-secondary"><span class="label">Description</span></div>
                        <div class="field-primary">
                            <div id="projects-view-description" class="pseudo-field no-border">
                            </div>
                        </div><!-- End Field Primary -->
                    </div><!-- End Field --> 
                    <div class="field field-input-name">
                        <div class="field-secondary"><span class="label">Production Date</span></div>
                        <div class="field-primary">
                            <div class="pseudo-field no-border">
                                <span class="value" id="projects-view-production"></span>
                            </div>
                        </div><!-- End Field Primary -->
                    </div><!-- End Field --> 
                    <div class="field field-input-name">
                        <div class="field-secondary"><span class="label">Date Created</span></div>
                        <div class="field-primary">
                            <div class="pseudo-field no-border">
                                <span class="value" id="projects-view-created"></span>
                            </div>
                        </div><!-- End Field Primary -->
                    </div><!-- End Field -->
                    <div class="field field-input-name">
                        <div class="field-secondary"><span class="label">Created by</span></div>
                        <div class="field-primary">
                            <div class="pseudo-field no-border">
                                <span class="value" id="projects-view-createdby"></span>
                            </div>
                        </div><!-- End Field Primary -->
                    </div><!-- End Field -->
                    <div class="field field-input-name">
                        <div class="field-secondary"><span class="label">Date Updated</span></div>
                        <div class="field-primary">
                            <div class="pseudo-field no-border">
                                <span class="value" id="projects-view-updated"></span>
                            </div>
                        </div><!-- End Field Primary -->
                    </div><!-- End Field -->
                    <div class="field field-input-name">
                        <div class="field-secondary"><span class="label">Updated by</span></div>
                        <div class="field-primary">
                            <div class="pseudo-field no-border">
                                <span class="value" id="projects-view-updatedby"></span>
                            </div>
                        </div><!-- End Field Primary -->
                    </div><!-- End Field -->
                    <div class="field field-input-name">
                        <div class="field-secondary"><span class="label">Status</span></div>
                        <div class="field-primary">
                            <div class="pseudo-field no-border">
                                <span class="value" id="projects-view-status"></span>
                                <a id="projects-view-change-button" href="#" class="small-text">[Change Status]</a>
                            </div>
                        </div><!-- End Field Primary -->
                    </div><!-- End Field --> 
                    <div id="projects-view-termination-con" class="field field-input-name">
                        <div class="field-secondary"><span class="label">Date Terminated</span></div>
                        <div class="field-primary">
                            <div class="pseudo-field no-border">
                                <span class="value" id="projects-view-termination"></span>
                            </div>
                        </div><!-- End Field Primary -->
                    </div><!-- End Field -->
                </div>
            </div>
        </form>

        <?php 
            $this->renderPartial('//projects/contact-persons');
            $this->renderPartial('//projects/point-persons');
            $this->renderPartial('//projects/project-notes');
        ?>

        <a id="projects-view-delete-button" href="#">[Delete Project]</a>
    </div>
    
    <div class="right-panel">
        <?php
            $this->renderPartial('//applications/applications-list');
            $this->renderPartial('//applications/applications-create');
            $this->renderPartial('//applications/applications-view');
            $this->renderPartial('//applications/applications-edit');
        ?>
    </div>
</div><!--END view user-->