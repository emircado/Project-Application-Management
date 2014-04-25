                        <!-- create part view -->
                        <div id="create-projects-view" style="display:none;" class="contact-info plain-list">
                            <!-- FORM HERE -->
                            <form>
                                <!-- CSRF TOKEN HERE -->
                                <input type="hidden" id="create-csrf" value="<?php echo Yii::app()->request->csrfToken ?>" />
                                <div class="contact-info-details">
                                    <div class="section primary-info expanded">
                                        <div id="expand-primary" class="header"><h3><b>Project Details</b></h3></div>
                                    </div>
                                    <!--CONTENT for CREATE PROJECT-->
                                    <div id="create-primary-content" class="content">
                                        <div class="field field-input-name">
                                            <div class="field-secondary"><span class="label">Name</span></div>
                                            <div class="field-primary">
                                                <div class="pseudo-field">
                                                <input type="text" id="create-name" class="text"></input>
                                                <span id="create-name-error" class="field-input-name-error error-message" style="display: none;"></span>
                                                </div>
                                            </div><!-- End Field Primary -->
                                        </div><!-- End Field -->
                                        <div class="field field-input-name">
                                            <div class="field-secondary"><span class="label">Code</span><span>(required)</span></div>
                                            <div class="field-primary">
                                                <div class="pseudo-field">
                                                <input type="text" id="create-code" class="text"></input>
                                                <span id="create-code-error" class="field-input-name-error error-message" style="display: none;"></span>
                                                </div>
                                            </div><!-- End Field Primary -->
                                        </div><!-- End Field -->
                                        <div class="field field-input-name">
                                            <div class="field-secondary"><span class="label">Description</span></div>
                                            <div class="field-primary">
                                                <div class="pseudo-field">
                                                <textarea rows="4" id="create-description" class="text"></textarea>
                                                <span id="create-description-error" class="field-input-name-error error-message" style="display: none;"></span>
                                                </div>
                                            </div><!-- End Field Primary -->
                                        </div><!-- End Field -->
                                        <div class="field field-input-name">
                                            <div class="field-secondary"><span class="label">Production Date</span></div>
                                            <div class="field-primary">
                                                <div class="pseudo-field">
                                                <input type="date" id="create-production" class="text"></input>
                                                <span id="create-production-error" class="field-input-name-error error-message" style="display: none;"></span>
                                                </div>
                                            </div><!-- End Field Primary -->
                                        </div><!-- End Field -->
                                        <div class="dialog-footer-block">
                                            <div class="field field-text">
                                                <div class="field-action-content">
                                                    <div class="pseudo-field pseudo-button">
                                                        <a id="create-button-cancel" class="cancel" href="#">Cancel</a>
                                                    </div>
                                                    <div class="pseudo-field pseudo-button primary-button">
                                                        <button id="create-button-create-project">Create</button>
                                                    </div>
                                                </div><!-- End Field Action Content -->
                                            </div><!-- End Field Action -->
                                        </div><!-- End UI Dialog Footer Block -->
                                    </div>
                                    <!--END CREATE CONTENT PROJECT-->
                                </div>
                            </form>
                        </div><!--END create project-->