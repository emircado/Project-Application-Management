<!-- view project note view -->
<div id="project-notes-view" style="display:none;" class="contact-info plain-list">
    <!-- CONTENT HERE -->
    <form>
        <input type="hidden" id="project-notes-view-csrf" value="<?php echo Yii::app()->request->csrfToken ?>" />
        <div class="contact-info-details">
            <div class="section primary-info expanded">
                <div id="expand-primary" class="header">
                    <h3><b>Note Details</b></h3>&nbsp&nbsp
                    <a id="project-notes-view-edit-button" href="#">[Edit]</a>
                    <a id="project-notes-view-delete-button" href="#" style="float:right;">[Delete]</a>
                </div>
            </div>
            <div id="edit-primary-content" class="content">
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Notes</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field no-border">
                            <span class="value" id="project-notes-view-notes"></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Date Created</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field no-border">
                            <span class="value" id="project-notes-view-created"></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Created by</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field no-border">
                            <span class="value" id="project-notes-view-createdby"></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Date Updated</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field no-border">
                            <span class="value" id="project-notes-view-updated"></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field --> 
                <a id="project-notes-view-back-button" href="#">[Back]</a>
            </div>
        </div>
    </form>
</div><!--END view project note-->