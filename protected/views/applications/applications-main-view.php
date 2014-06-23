<!-- view applications view -->
<div id="app-main-view" class="contact-info plain-list" style="display:none;">
    <div class="header-block-button" style="margin:0px;">
        <div class="pseudo-field back-button">
            <a id="app-main-view-back-button" href="#" title="Back to main" class="with-tool-tip"><span class="icon"></span><span class="tooltip">Back<span class="arrow icon"></span></span></a>
        </div>
    </div><br /><br />

    <!-- CONTENT HERE -->
    <div id="details-projects-view">
        <form>
            <input type="hidden" id="app-main-view-csrf" value="<?php echo Yii::app()->request->csrfToken ?>" />
            <div class="contact-info-details">
                <div class="section primary-info expanded">
                    <div id="expand-primary" class="header">
                        <h3><b>Application Details</b></h3>&nbsp&nbsp
                        <a id="app-main-view-edit-button" href="#">[Edit]</a>
                    </div>
                </div>
                <div id="edit-primary-content" class="content">
                    <div class="field field-input-name">
                        <div class="field-secondary"><span class="label">Name</span></div>
                        <div class="field-primary">
                            <div class="pseudo-field no-border">
                                <span class="value" id="app-main-view-name"></span>
                            </div>
                        </div><!-- End Field Primary -->
                    </div><!-- End Field -->
                    <div class="field field-input-name">
                        <div class="field-secondary"><span class="label">Project</span></div>
                        <div class="field-primary">
                            <div class="pseudo-field no-border">
                                <span class="value" id="app-main-view-project"></span>
                            </div>
                        </div><!-- End Field Primary -->
                    </div><!-- End Field -->
                    <div class="field field-input-name">
                        <div class="field-secondary"><span class="label">Type</span></div>
                        <div class="field-primary">
                            <div class="pseudo-field no-border">
                                <span class="value" id="app-main-view-type"></span>
                            </div>
                        </div><!-- End Field Primary -->
                    </div><!-- End Field -->
                    <div class="field field-input-name">
                        <div class="field-secondary"><span class="label">Accessibility</span></div>
                        <div class="field-primary">
                            <div class="pseudo-field no-border">
                                <span class="value" id="app-main-view-accessibility"></span>
                            </div>
                        </div><!-- End Field Primary -->
                    </div><!-- End Field -->
                    <div class="field field-input-name">
                        <div class="field-secondary"><span class="label">Repository</span></div>
                        <div class="field-primary">
                            <div class="pseudo-field no-border">
                                <span class="value" id="app-main-view-repository"></span>
                            </div>
                        </div><!-- End Field Primary -->
                    </div><!-- End Field -->
                    <div class="field field-input-name">
                        <div class="field-secondary"><span class="label">Uses Mobile Patterns</span></div>
                        <div class="field-primary">
                            <div class="pseudo-field no-border">
                                <span class="value" id="app-main-view-pattern"></span>
                            </div>
                        </div><!-- End Field Primary -->
                    </div><!-- End Field -->
                    <div class="field field-input-name">
                        <div class="field-secondary"><span class="label">Description</span></div>
                        <div class="field-primary">
                            <div id="app-main-view-description" class="pseudo-field no-border">
                            </div>
                        </div><!-- End Field Primary -->
                    </div><!-- End Field -->
                    <div class="field field-input-name">
                        <div class="field-secondary"><span class="label">Instructions</span></div>
                        <div class="field-primary">
                            <div id="app-main-view-instructions" class="pseudo-field no-border">
                            </div>
                        </div><!-- End Field Primary -->
                    </div><!-- End Field -->
                    <div class="field field-input-name">
                        <div class="field-secondary"><span class="label">R<?php echo htmlentities("&"); ?>D Point Person</span></div>
                        <div class="field-primary">
                            <div class="pseudo-field no-border">
                                <span class="value" id="app-main-view-pointperson"></span>
                            </div>
                        </div><!-- End Field Primary -->
                    </div><!-- End Field -->
                    <div class="field field-input-name">
                        <div class="field-secondary"><span class="label">Production Date</span></div>
                        <div class="field-primary">
                            <div class="pseudo-field no-border">
                                <span class="value" id="app-main-view-production"></span>
                            </div>
                        </div><!-- End Field Primary -->
                    </div><!-- End Field -->
                    <div class="field field-input-name">
                        <div class="field-secondary"><span class="label">Termination Date</span></div>
                        <div class="field-primary">
                            <div class="pseudo-field no-border">
                                <span class="value" id="app-main-view-termination"></span>
                            </div>
                        </div><!-- End Field Primary -->
                    </div><!-- End Field -->
                    <div class="field field-input-name">
                        <div class="field-secondary"><span class="label">Date Created</span></div>
                        <div class="field-primary">
                            <div class="pseudo-field no-border">
                                <span class="value" id="app-main-view-created"></span>
                            </div>
                        </div><!-- End Field Primary -->
                    </div><!-- End Field -->
                    <div class="field field-input-name">
                        <div class="field-secondary"><span class="label">Created by</span></div>
                        <div class="field-primary">
                            <div class="pseudo-field no-border">
                                <span class="value" id="app-main-view-createdby"></span>
                            </div>
                        </div><!-- End Field Primary -->
                    </div><!-- End Field -->
                    <div class="field field-input-name">
                        <div class="field-secondary"><span class="label">Date Updated</span></div>
                        <div class="field-primary">
                            <div class="pseudo-field no-border">
                                <span class="value" id="app-main-view-updated"></span>
                            </div>
                        </div><!-- End Field Primary -->
                    </div><!-- End Field -->
                    <div class="field field-input-name">
                        <div class="field-secondary"><span class="label">Updated by</span></div>
                        <div class="field-primary">
                            <div class="pseudo-field no-border">
                                <span class="value" id="app-main-view-updatedby"></span>
                            </div>
                        </div><!-- End Field Primary -->
                    </div><!-- End Field -->
                </div>
            </div>
        </form>

        <?php
            $this->renderPartial('//applications/application-notes');
        ?>

        <a id="app-main-view-delete-button" href="#">[Delete Application]</a>
    </div>
    <div class="right-panel">
        <?php
            $this->renderPartial('//applications/application-servers');
            $this->renderPartial('//applications/application-point-persons');
        ?>
    </div>
</div>