<!-- create applications view -->
<div id="applications-create" class="contact-info plain-list" style="display:none;">
    <!-- CONTENT HERE -->
    <form>
        <div class="contact-info-details">
            <div class="section primary-info expanded">
                <div id="expand-primary" class="header"><h3><b>Add Application</b></h3></div>
            </div>
            <!-- CONTENT FOR CREATE Application -->
            <div id="edit-primary-content" class="content">
                <input type="hidden" id="applications-create-csrf" value="<?php echo Yii::app()->request->csrfToken ?>" />
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Name*</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field">
                        <input id="applications-create-name" type="text" class="text"/>
                        <span id="applications-create-name-error" class="field-input-name-error error-message" style="display: none;"></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Type*</span></div>
                    <div id="applications-create-modal-container" class="field-primary">                     
                        <div class="pseudo-field">
                        <input id="applications-create-type" type="text" class="text"/>
                        <span id="applications-create-type-error" class="field-input-name-error error-message" style="display: none;"></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Accessibility*</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field">
                        <?php echo ZHtml::enumDropDownList(Applications::model(), 'accessibility', array(
                            'id'=>'applications-create-accessibility',
                            'class' => 'select',
                        )); ?>
                        <span id="applications-create-accessibility-error" class="field-input-name-error error-message" style="display: none;"></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Repository</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field">
                        <input id="applications-create-repository" type="text" class="text"></input>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Uses Mobile Patterns</span></div>
                    <div class="field-primary" style="padding-top:7px;">
                        <div class="pseudo-field">
                        <input id="applications-create-pattern" type="checkbox" style="margin-top:5px;"></input>
                        <span class="form-note"><i>(Check if Yes)</i></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Description</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field">
                        <textarea id="applications-create-description" rows="4" class="text"></textarea>
                        </div>
                        <div class="form-note"><i>(255 characters maximum)</i></div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Instructions</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field">
                        <textarea id="applications-create-instructions" rows="4" class="text"></textarea>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">R<?php echo htmlentities("&"); ?>D Point Person</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field">
                        <select id="applications-create-pointperson" class="select">
                        </select>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Production Date</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field">
                        <input id="applications-create-production" type="text" class="text"></input>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Termination Date</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field">
                        <input id="applications-create-termination" type="text" class="text"></input>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="dialog-footer-block">
                    <div class="field field-text">
                        <div class="field-action-content">
                            <div class="pseudo-field pseudo-button">
                                <a id="applications-create-cancel-button" class="cancel" href="#">Cancel</a>
                            </div>
                            <div class="pseudo-field pseudo-button primary-button">
                                <button id="applications-create-save-button">Create</button>
                            </div>
                        </div><!-- End Field Action Content -->
                    </div><!-- End Field Action -->
                </div><!-- End UI Dialog Footer Block -->
            </div>
        </div>
    </form>
</div><!--END create applications