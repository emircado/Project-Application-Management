<div id="projects-list-modal" class="dialog-box module" style="display:none;">
    <div class="dialog-container">
        <div class="dialog-content">
            <div class="dialog-header-block">
                <h3>Projects</h3>
                <a id="projects-list-modal-close-button" href="#" class="close-dialog" title="Close"><span class="icon"></span></a>
            </div>
            <form>
                <input type="hidden" id="projects-list-modal-csrf" value="<?php echo Yii::app()->request->csrfToken ?>" />
                <div class="contact-info-details">
                    <!-- body -->
                    <div id="edit-primary-content" class="content" style="padding:10px;">
                        <div class="height-limiter">
                            <table>
                                <thead>
                                    <tr>
                                        <th width="50">ID</th>
                                        <th width="250">Name</th>
                                        <th width="90">Code</th>
                                        <th width="50">Action</th>
                                    </tr>
                                    <tr>
                                        <th></th>
                                        <th><input id="projects-list-modal-name" type="text" style="width:180px;"/></th>
                                        <th><input id="projects-list-modal-code" type="text" style="width:70px;"/></th>
                                        <th><div><button id="projects-list-modal-search-button" class="red-button">Search</button></div><a id="projects-list-modal-clear-button" href="#">Clear</a></th>
                                    </tr>
                                </thead>
                                <tbody id="projects-list-modal-table">
                                </tbody>
                            </table>
                        </div>
                        <div class="page-nav">
                            <div class="page-count">
                                <span class="current-page" id="projects-list-modal-part"></span>
                                <span class="all-page" id="projects-list-modal-total"></span>
                            </div>
                            <div class="page-nav-arrow">
                                <a id="projects-list-modal-prev" class="prev" href="#" title="Previous"><span class="icon"></span></a>
                                <a id="projects-list-modal-next" class="next" href="#" title="Next"><span class="icon"></span></a>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>