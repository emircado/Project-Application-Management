<!-- view note view -->
<div id="servers-view" class="contact-info plain-list" style="display:none;">
    <div class="header-block-button" style="margin:0px;">
        <div class="pseudo-field back-button">
            <a id="servers-view-back-button" href="#" title="Back to main" class="with-tool-tip"><span class="icon"></span><span class="tooltip">Back<span class="arrow icon"></span></span></a>
        </div>
    </div><br /><br />

    <!-- CONTENT HERE -->
    <form>
        <input type="hidden" id="servers-view-csrf" value="<?php echo Yii::app()->request->csrfToken ?>"/>
        <div class="contact-info-details">
            <div class="section primary-info expanded">
                <div id="expand-primary" class="header">
                    <h3><b>Server Details</b></h3>&nbsp&nbsp
                    <a id="servers-view-edit-button" href="#">[Edit]</a>
                </div>
            </div>
            <div id="edit-primary-content" class="content">
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Name</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field no-border">
                            <span id="servers-view-name" class="value"></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Type</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field no-border">
                            <span id="servers-view-type" class="value"></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Host</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field no-border">
                            <span id="servers-view-host" class="value"></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Public IP</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field no-border">
                            <span id="servers-view-public" class="value"></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Private IP</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field no-border">
                            <span id="servers-view-private" class="value"></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Network</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field no-border">
                            <span id="servers-view-network" class="value"></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Location</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field no-border">
                            <span id="servers-view-location" class="value"></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Description</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field no-border">
                            <span id="servers-view-description" class="value"></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Production Date</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field no-border">
                            <span id="servers-view-production" class="value"></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Termination Date</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field no-border">
                            <span id="servers-view-termination" class="value"></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Date Created</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field no-border">
                            <span id="servers-view-created" class="value"></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Created by</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field no-border">
                            <span id="servers-view-createdby" class="value"></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Date Updated</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field no-border">
                            <span id="servers-view-updated" class="value"></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Updated by</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field no-border">
                            <span id="servers-view-updatedby" class="value"></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
            </div>
        </div>
    </form>

    <a id="servers-view-delete-button" href="#">[Delete Server]</a>
</div><!--END view note