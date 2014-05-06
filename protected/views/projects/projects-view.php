<!-- view part view -->
<div id="view-projects-view" style="display:none;" class="contact-info plain-list">
    <div class="header-block-button" style="margin:0px;">
        <div class="pseudo-field back-button">
            <a id="view-to-main" href="#" title="Back to main" class="with-tool-tip"><span class="icon"></span><span class="tooltip">Back<span class="arrow icon"></span></span></a>
        </div>
    </div><br /><br />

    <div id="details-projects-view">
        <!-- CONTENT HERE -->
        <form>
            <input type="hidden" id="view-csrf" value="<?php echo Yii::app()->request->csrfToken ?>" />
            <div class="contact-info-details">
                <div class="section primary-info expanded">
                    <div id="expand-primary" class="header">
                        <h3><b>Project Details</b></h3>&nbsp&nbsp
                        <a id="edit" href="#">[Edit]</a>
                    </div>
                </div>
                <div id="edit-primary-content" class="content">
                    <div class="field field-input-name">
                        <div class="field-secondary"><span class="label">Name</span></div>
                        <div class="field-primary">
                            <div class="pseudo-field no-border">
                                <span class="value" id="view-name"></span>
                            </div>
                        </div><!-- End Field Primary -->
                    </div><!-- End Field -->
                    <div class="field field-input-name">
                        <div class="field-secondary"><span class="label">Code</span></div>
                        <div class="field-primary">
                            <div class="pseudo-field no-border">
                                <span class="value" id="view-code"></span>
                            </div>
                        </div><!-- End Field Primary -->
                    </div><!-- End Field --> 
                    <div class="field field-input-name">
                        <div class="field-secondary"><span class="label">Description</span></div>
                        <div class="field-primary">
                            <div class="pseudo-field no-border">
                                <span class="value" id="view-description"></span>
                            </div>
                        </div><!-- End Field Primary -->
                    </div><!-- End Field --> 
                    <div class="field field-input-name">
                        <div class="field-secondary"><span class="label">Production Date</span></div>
                        <div class="field-primary">
                            <div class="pseudo-field no-border">
                                <span class="value" id="view-production"></span>
                            </div>
                        </div><!-- End Field Primary -->
                    </div><!-- End Field --> 
                    <div class="field field-input-name">
                        <div class="field-secondary"><span class="label">Date Created</span></div>
                        <div class="field-primary">
                            <div class="pseudo-field no-border">
                                <span class="value" id="view-created"></span>
                            </div>
                        </div><!-- End Field Primary -->
                    </div><!-- End Field -->
                    <div class="field field-input-name">
                        <div class="field-secondary"><span class="label">Created by</span></div>
                        <div class="field-primary">
                            <div class="pseudo-field no-border">
                                <span class="value" id="view-createdby"></span>
                            </div>
                        </div><!-- End Field Primary -->
                    </div><!-- End Field -->
                    <div class="field field-input-name">
                        <div class="field-secondary"><span class="label">Date Updated</span></div>
                        <div class="field-primary">
                            <div class="pseudo-field no-border">
                                <span class="value" id="view-updated"></span>
                            </div>
                        </div><!-- End Field Primary -->
                    </div><!-- End Field -->
                    <div class="field field-input-name">
                        <div class="field-secondary"><span class="label">Updated by</span></div>
                        <div class="field-primary">
                            <div class="pseudo-field no-border">
                                <span class="value" id="view-updatedby"></span>
                            </div>
                        </div><!-- End Field Primary -->
                    </div><!-- End Field -->
                    <div class="field field-input-name">
                        <div class="field-secondary"><span class="label">Status</span></div>
                        <div class="field-primary">
                            <div class="pseudo-field no-border">
                                <span class="value" id="view-status"></span>
                                <a id="view-button-change-status" href="#">[Change Status]</a>
                            </div>
                        </div><!-- End Field Primary -->
                    </div><!-- End Field --> 
                    <div id="view-termination-field" class="field field-input-name">
                        <div class="field-secondary"><span class="label">Date Terminated</span></div>
                        <div class="field-primary">
                            <div class="pseudo-field no-border">
                                <span class="value" id="view-termination"></span>
                            </div>
                        </div><!-- End Field Primary -->
                    </div><!-- End Field -->
                </div>
            </div>
        </form>

        <!-- CONTACT PERSONS HERE -->
        <?php 
            $this->renderPartial('//projects/contact_persons/contact-persons-list');
            $this->renderPartial('//projects/contact_persons/contact-persons-create'); 
            $this->renderPartial('//projects/contact_persons/contact-persons-view');
            $this->renderPartial('//projects/contact_persons/contact-persons-edit');
        ?>

        <!-- POINT PERSONS HERE -->
        <?php
            $this->renderPartial('//projects/point_persons/point-persons-list');
            $this->renderPartial('//projects/point_persons/point-persons-create');
            $this->renderPartial('//projects/point_persons/point-persons-view');
            $this->renderPartial('//projects/point_persons/point-persons-edit');
        ?>
        <a id="delete" href="#">[Delete Project]</a>
    </div>
    <div id="applications-list">
        <?php
            $this->renderPartial('//projects/applications/applications-list');
            $this->renderPartial('//projects/applications/applications-create');
            $this->renderPartial('//projects/applications/applications-view');
            $this->renderPartial('//projects/applications/applications-edit');
        ?>
    </div>
</div><!--END view user-->