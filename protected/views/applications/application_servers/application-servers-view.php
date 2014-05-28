<!-- view note view -->
<div id="app-servers-view" class="contact-info plain-list" style="display:none;">
    <!-- CONTENT HERE -->
    <form>
        <div class="contact-info-details">
            <input type="hidden" id="app-servers-view-csrf" value="<?php echo Yii::app()->request->csrfToken ?>" />
            <div class="section primary-info expanded">
                <div id="expand-primary" class="header">
                    <h3><b>Server Details</b></h3>&nbsp&nbsp
                    <a id="app-servers-edit-button" href="#">[Edit]</a>
                    <a id="app-servers-delete-button" href="#" style="float:right;">[Delete]</a>
                </div>
            </div>
            <div id="edit-primary-content" class="content">
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Name</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field no-border">
                            <span id="app-servers-view-name" class="value"></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Type</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field no-border">
                            <span id="app-servers-view-type" class="value"></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Private IP</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field no-border">
                            <span id="app-servers-view-private" class="value"></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div id="app-servers-view-details-container" style="display:none;">
                    <div class="field field-input-name">
                        <div class="field-secondary"><span class="label">Host</span></div>
                        <div class="field-primary">
                            <div class="pseudo-field no-border">
                                <span id="app-servers-view-host" class="value"></span>
                            </div>
                        </div><!-- End Field Primary -->
                    </div><!-- End Field -->
                    <div class="field field-input-name">
                        <div class="field-secondary"><span class="label">Public IP</span></div>
                        <div class="field-primary">
                            <div class="pseudo-field no-border">
                                <span id="app-servers-view-public" class="value"></span>
                            </div>
                        </div><!-- End Field Primary -->
                    </div><!-- End Field -->
                    <div class="field field-input-name">
                        <div class="field-secondary"><span class="label">Network</span></div>
                        <div class="field-primary">
                            <div class="pseudo-field no-border">
                                <span id="app-servers-view-network" class="value"></span>
                            </div>
                        </div><!-- End Field Primary -->
                    </div><!-- End Field -->
                </div>
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Application Path</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field no-border">
                            <span id="app-servers-view-path" class="value"></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Application Log</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field no-border">
                            <span id="app-servers-view-log" class="value"></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Date Created</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field no-border">
                            <span id="app-servers-view-created" class="value"></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Created by</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field no-border">
                            <span id="app-servers-view-createdby" class="value"></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Date Updated</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field no-border">
                            <span id="app-servers-view-updated" class="value"></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Updated by</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field no-border">
                            <span id="app-servers-view-updatedby" class="value"></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <a id="app-servers-view-details-button" href="#" style="margin-left:225px;">[server details]</a>
                <br>
                <a id="app-servers-view-back-button" href="#">[Back]</a>
            </div>
        </div>
    </form>
</div><!--END view note-->